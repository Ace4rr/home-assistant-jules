"""Sensor platform for Jules Agent."""
from __future__ import annotations

import logging

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    ATTR_MESSAGES,
    ATTR_SESSIONS,
    ATTR_SOURCES,
    DOMAIN,
    STATE_AWAITING_INPUT,
    STATE_COMPLETED,
    STATE_FAILED,
    STATE_IN_PROGRESS,
    STATE_PAUSED,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the sensor platform."""
    data = hass.data[DOMAIN][config_entry.entry_id]
    entities = [
        JulesStatusSensor(config_entry, data["coordinator"]),
        JulesCurrentTaskSensor(config_entry, data["coordinator"]),
        JulesSessionsSensor(config_entry, data["coordinator"]),
        JulesChatSensor(data["chat"], config_entry),
    ]
    async_add_entities(entities)
    data["entities"]["chat"] = entities[3]


class JulesBaseSensor(CoordinatorEntity, SensorEntity):
    """Base class for Jules sensors backed by the coordinator."""

    def __init__(self, config_entry: ConfigEntry, coordinator) -> None:
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def _sessions(self) -> list[dict]:
        data = self.coordinator.data or {}
        return data.get("sessions", []) or []

    @property
    def _sources(self) -> list[dict]:
        data = self.coordinator.data or {}
        return data.get("sources", []) or []


class JulesStatusSensor(JulesBaseSensor):
    """Aggregated agent status derived from session states."""

    _attr_name = "Jules Agent Status"
    _attr_icon = "mdi:robot-outline"

    def __init__(self, config_entry: ConfigEntry, coordinator) -> None:
        super().__init__(config_entry, coordinator)
        self._attr_unique_id = f"{config_entry.entry_id}_status"

    @property
    def native_value(self) -> str:
        sessions = self._sessions
        states = [s.get("state", "") for s in sessions]
        if STATE_IN_PROGRESS in states or STATE_QUEUED in states:
            return "working"
        if STATE_AWAITING_INPUT in states:
            return "attention"
        if STATE_PAUSED in states:
            return "paused"
        if STATE_FAILED in states:
            return "error"
        if sessions:
            return "idle"
        return "unknown"


class JulesCurrentTaskSensor(JulesBaseSensor):
    """Title of the most recent active (or last) session."""

    _attr_name = "Jules Current Task"
    _attr_icon = "mdi:text-box-outline"

    def __init__(self, config_entry: ConfigEntry, coordinator) -> None:
        super().__init__(config_entry, coordinator)
        self._attr_unique_id = f"{config_entry.entry_id}_task"

    @property
    def _ordered(self) -> list[dict]:
        return sorted(
            self._sessions,
            key=lambda s: s.get("updateTime", ""),
            reverse=True,
        )

    @property
    def native_value(self) -> str:
        ordered = self._ordered
        for session in ordered:
            if session.get("state") not in (STATE_COMPLETED, STATE_FAILED):
                return session.get("title", "")
        return ordered[0].get("title", "") if ordered else "No active task"

    @property
    def extra_state_attributes(self) -> dict:
        ordered = self._ordered
        if not ordered:
            return {}
        first = ordered[0]
        return {"session_id": first.get("id"), "session_state": first.get("state")}


class JulesSessionsSensor(JulesBaseSensor):
    """All recent sessions and codebases for the Lovelace card."""

    _attr_name = "Jules Sessions"
    _attr_icon = "mdi:format-list-bulleted"

    def __init__(self, config_entry: ConfigEntry, coordinator) -> None:
        super().__init__(config_entry, coordinator)
        self._attr_unique_id = f"{config_entry.entry_id}_sessions"

    @property
    def native_value(self) -> int:
        return len(self._sessions)

    @property
    def extra_state_attributes(self) -> dict:
        return {
            ATTR_SESSIONS: self._sessions,
            ATTR_SOURCES: self._sources,
        }


class JulesChatSensor(SensorEntity):
    """Chat messages of the session last opened via jules.load_chat."""

    _attr_name = "Jules Chat"
    _attr_icon = "mdi:chat-outline"
    _attr_should_poll = False

    def __init__(self, chat_store: dict, config_entry: ConfigEntry) -> None:
        self._chat_store = chat_store
        self._attr_unique_id = f"{config_entry.entry_id}_chat"

    @property
    def _chat(self) -> dict:
        return self._chat_store

    @property
    def native_value(self) -> str:
        return self._chat.get("session_id") or "none"

    @property
    def extra_state_attributes(self) -> dict:
        chat = self._chat
        return {
            "session_id": chat.get("session_id"),
            "title": chat.get("title", ""),
            ATTR_MESSAGES: chat.get("messages", []),
        }
