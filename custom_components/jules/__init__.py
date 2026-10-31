"""The Jules Agent integration."""
from __future__ import annotations

import logging
from datetime import timedelta

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import JulesApiClient, JulesApiError
from .const import (
    CONF_API_TOKEN,
    CONF_API_URL,
    DEFAULT_API_URL,
    DOMAIN,
    SERVICE_CREATE_SESSION,
    SERVICE_LOAD_CHAT,
    SERVICE_SEND_MESSAGE,
    UPDATE_INTERVAL,
)

PLATFORMS: list[Platform] = [Platform.SENSOR]

_LOGGER = logging.getLogger(__name__)

SERVICE_LOAD_CHAT_SCHEMA = vol.Schema(
    {vol.Required("session_id"): cv.string}
)
SERVICE_SEND_MESSAGE_SCHEMA = vol.Schema(
    {vol.Required("session_id"): cv.string, vol.Required("text"): cv.string}
)
SERVICE_CREATE_SESSION_SCHEMA = vol.Schema(
    {vol.Required("source_id"): cv.string, vol.Required("prompt"): cv.string}
)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Jules Agent from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    if hasattr(hass.http, "async_register_static_paths"):
        from homeassistant.components.http import StaticPathConfig
        await hass.http.async_register_static_paths([
            StaticPathConfig("/jules_local", hass.config.path("custom_components/jules/www"), cache_headers=False)
        ])
    else:
        hass.http.register_static_path('/jules_local', hass.config.path('custom_components/jules/www'), cache_headers=False)

    client = JulesApiClient(
        entry.data.get(CONF_API_URL) or DEFAULT_API_URL,
        entry.data.get(CONF_API_TOKEN, ""),
        async_get_clientsession(hass),
    )

    async def async_update_data() -> dict:
        try:
            sources, sessions = await client.list_sources(), await client.list_sessions()
        except JulesApiError as err:
            raise UpdateFailed(f"Jules API error: {err}") from err
        return {"sources": sources, "sessions": sessions}

    coordinator = DataUpdateCoordinator(
        hass,
        _LOGGER,
        name=f"{DOMAIN}_coordinator",
        update_interval=timedelta(seconds=UPDATE_INTERVAL),
        update_method=async_update_data,
    )

    # Do not block setup if the API is unreachable: the card must keep working.
    try:
        await coordinator.async_config_entry_first_refresh()
    except Exception as err:  # noqa: BLE001
        _LOGGER.warning("Initial Jules API refresh failed, starting empty: %s", err)
        coordinator.data = {"sources": [], "sessions": []}

    hass.data[DOMAIN][entry.entry_id] = {
        "client": client,
        "coordinator": coordinator,
        "chat": {"session_id": None, "title": "", "messages": []},
        "entities": {},
    }

    async def async_load_chat(call: ServiceCall) -> None:
        session_id = call.data["session_id"]
        try:
            messages = await client.list_activities(session_id)
        except JulesApiError as err:
            _LOGGER.error("Failed to load chat %s: %s", session_id, err)
            messages = []
            error = str(err)
        else:
            error = None
            if not messages:
                error = "API вернул пустую историю (HTTP 200) — детали в логах HA, фильтр 'jules'"
        branch = pr_url = None
        try:
            detail = await client.get_session(session_id)
            branch, pr_url = detail.get("branch"), detail.get("pr_url")
        except Exception:  # noqa: BLE001 — detail is optional decoration
            pass
        store = hass.data[DOMAIN][entry.entry_id]["chat"]
        store.update({
            "session_id": session_id, "title": session_id, "messages": messages,
            "error": error, "branch": branch, "pr_url": pr_url,
        })
        entity = hass.data[DOMAIN][entry.entry_id]["entities"].get("chat")
        if entity:
            entity.async_write_ha_state()

    async def async_send_message(call: ServiceCall) -> None:
        session_id = call.data["session_id"]
        try:
            await client.send_message(session_id, call.data["text"])
        except JulesApiError as err:
            _LOGGER.error("Failed to send message to %s: %s", session_id, err)
        await hass.services.async_call(DOMAIN, SERVICE_LOAD_CHAT, {"session_id": session_id}, blocking=True)

    async def async_create_session(call: ServiceCall) -> None:
        try:
            await client.create_session(call.data["source_id"], call.data["prompt"])
        except JulesApiError as err:
            _LOGGER.error("Failed to create session: %s", err)
            return
        await coordinator.async_request_refresh()

    hass.services.async_register(DOMAIN, SERVICE_LOAD_CHAT, async_load_chat, schema=SERVICE_LOAD_CHAT_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_SEND_MESSAGE, async_send_message, schema=SERVICE_SEND_MESSAGE_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_CREATE_SESSION, async_create_session, schema=SERVICE_CREATE_SESSION_SCHEMA)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        for service in (SERVICE_LOAD_CHAT, SERVICE_SEND_MESSAGE, SERVICE_CREATE_SESSION):
            hass.services.async_remove(DOMAIN, service)
        hass.data[DOMAIN].pop(entry.entry_id, None)

    return unload_ok
