# Home-Assistant Jules Agent Integration

[![GitHub Release](https://img.shields.io/github/v/release/jules/homeassistant-jules?style=for-the-badge)](https://github.com/jules/homeassistant-jules/releases)
[![License](https://img.shields.io/github/license/jules/homeassistant-jules?style=for-the-badge)](LICENSE)

[![hacs](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://hacs.xyz/docs/faq/custom_repositories)


_Home Assistant Integration for Jules Agent._

Supported Features:
 * Native backend integration (Python) communicating with official Jules REST API.
 * Translates Jules agent data into standard Home Assistant entities (e.g., `sensor.jules_agent_status`, `sensor.jules_current_task`).
 * Custom Lovelace Card (LitElement) for beautiful visualization of agent status, progress, and task description.
 * Safe storage of API keys on the server side.
 * Seamless configuration via Home Assistant UI (Config Flow), no YAML editing required.
 * Automate based on agent statuses (e.g., trigger notifications when an agent finishes a task).
 * Supports polling or websocket constant connection (depending on API capabilities).

## Installation

### Recommended: [HACS](https://www.hacs.xyz)

1. Add this repository as a custom repository to HACS: [![Add Repository](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=jules&repository=homeassistant-jules&category=integration)
2. Use HACS to install the integration.
3. Restart Home Assistant.
4. Set up the integration using the UI: [![Add Integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=jules)

### Alternatives
<details>
<summary>Alternatives</summary>

### Manual
1. Using the tool of choice open the directory (folder) for your HA configuration (where you find `configuration.yaml`).
2. If you do not have a `custom_components` directory (folder) there, you need to create it.
3. In the `custom_components` directory (folder) create a new folder called `jules`.
4. Download _all_ the files from the `custom_components/jules/` directory in this repository.
5. Place the files you downloaded in the new directory you created.
6. Restart Home Assistant.
7. In the HA UI go to "Configuration" -> "Integrations" click "+" and search for "Jules Agent".

</details>

## Configuration

Configuration is done via the Home Assistant UI. Go to Settings -> Devices & Services -> Add Integration and search for "Jules Agent".
You will need to provide the API URL and your access token.
