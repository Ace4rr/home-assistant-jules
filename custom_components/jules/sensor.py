"""Sensor platform for Jules Agent."""
from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN

async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the sensor platform."""
    # В будущем здесь будут получаться данные из Coordinator

    async_add_entities([
        JulesStatusSensor(config_entry),
        JulesTaskSensor(config_entry)
    ])


class JulesStatusSensor(SensorEntity):
    """Representation of a Jules Status Sensor."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        """Initialize the sensor."""
        self._attr_name = "Jules Agent Status"
        self._attr_unique_id = f"{config_entry.entry_id}_status"
        # Моковое начальное состояние
        self._attr_native_value = "working"

    @property
    def icon(self) -> str:
        """Return the icon of the sensor."""
        return "mdi:robot-outline"


class JulesTaskSensor(SensorEntity):
    """Representation of a Jules Current Task Sensor."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        """Initialize the sensor."""
        self._attr_name = "Jules Current Task"
        self._attr_unique_id = f"{config_entry.entry_id}_task"
        # Моковое начальное состояние
        self._attr_native_value = "Analyzing codebase..."

    @property
    def icon(self) -> str:
        """Return the icon of the sensor."""
        return "mdi:text-box-outline"
