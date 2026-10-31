# Jules Agent

[![GitHub Release](https://img.shields.io/github/v/release/Ace4rr/home-assistant-jules?style=for-the-badge)](https://github.com/Ace4rr/home-assistant-jules/releases)
[![License](https://img.shields.io/github/license/Ace4rr/home-assistant-jules?style=for-the-badge)](LICENSE)

[![hacs](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://hacs.xyz/docs/faq/custom_repositories)


_Home Assistant Integration for Jules Agent._

Supported Features:
 * Native backend integration (Python) communicating with the official Jules REST API (v1alpha, `jules.googleapis.com`).
 * Jules-style multi-panel Lovelace card: logo rail, Sessions panel (with Scheduled), interactive chat panel (open/close dialogs, "Talk to Jules" input), "New session" panel (create tasks) and a Statistics panel with activity breakdown.
 * Standard HA entities: `sensor.jules_agent_status`, `sensor.jules_current_task`, `sensor.jules_sessions` (sessions + codebases as attributes), `sensor.jules_chat` (opened chat messages).
 * Services: `jules.load_chat`, `jules.send_message`, `jules.create_session` — the card wires them to chat opening, the chat input and the task input.
 * Safe storage of API keys on the server side.
 * Seamless configuration via Home Assistant UI (Config Flow), no YAML editing required.

## Installation

### Recommended: [HACS](https://www.hacs.xyz)

1. Add this repository as a custom repository to HACS: [![Add Repository](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Ace4rr&repository=home-assistant-jules&category=integration)
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


## Lovelace Dashboard Installation

To add the Jules Agent Card to your Lovelace dashboard:

1. In Home Assistant, go to **Settings** -> **Dashboards** -> **Resources** (or three dots -> Manage resources on your dashboard).
2. Click **Add Resource**.
3. Set the URL to `/jules_local/jules-agent-card.js` (this path is automatically provided by the integration, no need to copy files manually).
4. Set Resource type to **JavaScript Module**.
5. Refresh your browser or the Home Assistant companion app.

Now, you can add a manual card to your dashboard with the following YAML configuration:

```yaml
type: custom:jules-agent-card
```

### Card options

| Option | Default | Description |
|---|---|---|
| `url` | `https://jules.google.com` | Base link used by "Open in Jules" and session deep links |
| `sessions_entity` | `sensor.jules_sessions` | Entity with `sessions` and `sources` attributes |
| `chat_entity` | `sensor.jules_chat` | Entity with the opened chat messages |
| `status_entity` | `sensor.jules_agent_status` | Aggregate status entity |
| `task_entity` | `sensor.jules_current_task` | Current task title entity |

If the API returns nothing (no key yet / API unreachable), the card shows sample data so it still looks and behaves like Jules.

## Entities and services

| Entity | Meaning |
|---|---|
| `sensor.jules_agent_status` | `working` / `attention` / `paused` / `error` / `idle` |
| `sensor.jules_current_task` | Title of the latest active session |
| `sensor.jules_sessions` | State = number of sessions; attributes `sessions` and `sources` |
| `sensor.jules_chat` | Chat of the last opened session; attribute `messages` |

| Service | Fields | Effect |
|---|---|---|
| `jules.load_chat` | `session_id` | Loads session messages into `sensor.jules_chat` |
| `jules.send_message` | `session_id`, `text` | Sends a message to the session, then refreshes the chat |
| `jules.create_session` | `source_id`, `prompt` | Starts a new task for a codebase |

> **API URL and key.** The integration expects the public Jules API: URL `https://jules.googleapis.com`, and a Jules API key as the token. If you created the integration entry before v1.2.0 with the old default URL (`api.jules.ai`), delete and re-add the integration so the new default is used.

## Troubleshooting

**"Custom element doesn't exist: jules-agent-card"**

The card JS is served by the integration itself at `/jules_local/jules-agent-card.js`, so this error almost always means the browser failed to load that file:

1. Make sure the integration is **set up** (Settings → Devices & Services → Jules Agent). The `/jules_local` path is registered only when the integration entry is loaded.
2. Open `http://<your-ha>:8123/jules_local/jules-agent-card.js` in a browser tab — it must return JavaScript code, not 404. If it returns 404, the integration is not set up (see step 1).
3. Check the resource: Settings → Dashboards → Resources → URL must be exactly `/jules_local/jules-agent-card.js`, type **JavaScript Module**.
4. Hard-refresh the dashboard (**Ctrl+F5**, or force-kill and reopen the companion app) — browser caches resources aggressively.

**After updating the integration the card doesn't change**

Browsers cache the card JS. Do a hard refresh (Ctrl+F5) after updating. Note that HACS installs code from GitHub: if a fix exists only in your working copy (not committed, pushed and released), reinstalling via HACS brings the **old** version back. Publish a release and update through HACS, or copy the files manually.

**Reinstalling**

You can safely remove and re-add the integration at any time: HACS → delete, restart, install again, then set it up in Settings → Devices & Services (the API URL and token are stored in the integration entry, so you will need to enter them again). If HACS fails to download the repository, install the latest [release](https://github.com/Ace4rr/home-assistant-jules/releases) — updates are delivered through GitHub releases.

## Configuration

Configuration is done via the Home Assistant UI. Go to Settings -> Devices & Services -> Add Integration and search for "Jules Agent".
You will need to provide the API URL and your access token.
