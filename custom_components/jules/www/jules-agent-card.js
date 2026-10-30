const DEFAULT_SESSIONS = [
  { title: "Очистка проекта и обновление зависимостей", status: "done" },
  { title: "Исправление ошибки версии и сборки", status: "done" },
  { title: "README в стиле Meshtastic Homepage", status: "done" },
  { title: "Интеграция панели агентов Jules", status: "done" },
  { title: "Удаление водяных знаков Z.ai", status: "done" },
];

const STATUS_WORKING = "working";
const STATUS_DONE = "done";
const STATUS_ATTENTION = "attention";

class JulesAgentCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._collapsed = false;
    this._menuFor = null;
    this._renderKey = "";
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration");
    }
    this.config = {
      title: "Recent sessions",
      url: "https://jules.google.com",
      status_entity: "sensor.jules_agent_status",
      task_entity: "sensor.jules_current_task",
      sessions: DEFAULT_SESSIONS,
      ...config,
    };
    this._renderKey = "";
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.config) return;
    const key = this._statusKey();
    if (key !== this._renderKey) {
      this._renderKey = key;
      this._render();
    }
  }

  _statusKey() {
    const hass = this._hass;
    if (!hass || !hass.states) return "";
    const status = hass.states[this.config.status_entity];
    const task = hass.states[this.config.task_entity];
    return `${task ? task.state : ""}|${status ? status.state : ""}`;
  }

  _activeSession() {
    const hass = this._hass;
    const taskState = hass && hass.states ? hass.states[this.config.task_entity] : null;
    const statusState = hass && hass.states ? hass.states[this.config.status_entity] : null;
    const task = taskState ? taskState.state : "No active task";
    const raw = statusState ? (statusState.state || "").toLowerCase() : "";
    let status = STATUS_WORKING;
    if (/done|complete|idle|success|stopped|finish/.test(raw)) status = STATUS_DONE;
    else if (/error|fail|attention|input|need|wait/.test(raw)) status = STATUS_ATTENTION;
    return { title: task, status };
  }

  _openJules() {
    window.open(this.config.url, "_blank");
  }

  _refreshData() {
    if (!this._hass || !this._hass.callService) return;
    this._hass.callService("homeassistant", "update_entity", {
      entity_id: [this.config.status_entity, this.config.task_entity],
    });
  }

  _toggleMenu(index, ev) {
    ev.stopPropagation();
    this._menuFor = this._menuFor === index ? null : index;
    this._render();
  }

  _render() {
    if (!this.config) return;

    if (!this.card) {
      this.card = document.createElement("ha-card");
      this.card.style.background = "#1e1f20";
      this.card.style.borderRadius = "16px";
      this.card.style.color = "#e3e3e3";
      this.card.style.fontFamily = "'Google Sans', system-ui, -apple-system, sans-serif";
      this.card.style.overflow = "visible";
      this.appendChild(this.card);
    }

    const active = this._activeSession();
    const sessions = [active, ...this.config.sessions];

    const rows = sessions
      .map((s, i) => {
        const icon = this._statusIcon(s.status);
        return `
          <div class="session-item ${s.status === STATUS_WORKING ? "active" : ""}" data-index="${i}">
            ${icon}
            <div class="session-title">${this._escape(s.title)}</div>
            <div class="session-dots" data-menu="${i}" title="Меню">
              <ha-icon icon="mdi:dots-horizontal" style="--mdc-icon-size: 20px;"></ha-icon>
            </div>
            ${this._menuFor === i ? this._menuHtml() : ""}
          </div>`;
      })
      .join("");

    this.card.innerHTML = `
      <style>
        .jules-wrap { position: relative; padding: 6px 0 8px; }
        .jules-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 20px 10px; font-size: 14px; color: #9aa0a6;
        }
        .jules-chevron {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
          color: #9aa0a6; background: transparent; transition: background .15s;
        }
        .jules-chevron:hover { background: rgba(255,255,255,.08); }
        .jules-chevron ha-icon { transition: transform .2s; }
        .jules-chevron.collapsed ha-icon { transform: rotate(180deg); }
        .session-item {
          position: relative; display: flex; align-items: center;
          padding: 10px 12px 10px 16px; margin: 2px 8px; border-radius: 12px;
          gap: 12px; font-size: 14px; cursor: pointer;
        }
        .session-item:hover { background: #2a2b2d; }
        .session-item.active { background: #333537; }
        .session-icon {
          display: flex; align-items: center; justify-content: center;
          width: 18px; height: 18px; flex: none; color: #8e918f;
        }
        .session-item.active .session-icon { color: #8ab4f8; }
        .session-item.attention .session-icon { color: #fdd663; }
        .jules-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(138,180,248,.25); border-top-color: #8ab4f8;
          animation: jules-spin 1s linear infinite;
        }
        @keyframes jules-spin { to { transform: rotate(360deg); } }
        .session-title {
          flex: 1; font-size: 14px; font-weight: 500; color: #e3e3e3;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .session-dots {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; flex: none; margin-right: -6px;
          border-radius: 50%; color: #9aa0a6; cursor: pointer; transition: background .15s;
        }
        .session-dots:hover { background: rgba(255,255,255,.08); }
        .jules-menu {
          position: absolute; right: 8px; top: 44px; z-index: 20;
          min-width: 190px; padding: 6px 0;
          background: #2d2f31; border-radius: 10px;
          box-shadow: 0 6px 20px rgba(0,0,0,.45);
        }
        .jules-menu-item {
          padding: 10px 16px; font-size: 14px; color: #e3e3e3;
          cursor: pointer; white-space: nowrap;
        }
        .jules-menu-item:hover { background: #3c4043; }
        .jules-backdrop { position: fixed; inset: 0; z-index: 15; background: transparent; }
        .jules-collapsed { display: none; }
      </style>
      <div class="jules-wrap">
        <div class="jules-header">
          <span>${this._escape(this.config.title)}</span>
          <div class="jules-chevron ${this._collapsed ? "collapsed" : ""}" data-chevron title="Свернуть">
            <ha-icon icon="mdi:chevron-up" style="--mdc-icon-size: 20px;"></ha-icon>
          </div>
        </div>
        <div class="${this._collapsed ? "jules-collapsed" : ""}">${rows}</div>
        ${this._menuFor !== null ? '<div class="jules-backdrop" data-backdrop></div>' : ""}
      </div>
    `;

    this._attachEvents();
  }

  _statusIcon(status) {
    if (status === STATUS_WORKING) {
      return '<div class="session-icon"><div class="jules-spinner"></div></div>';
    }
    if (status === STATUS_ATTENTION) {
      return '<div class="session-icon"><ha-icon icon="mdi:alert-circle-outline" style="--mdc-icon-size: 18px;"></ha-icon></div>';
    }
    return '<div class="session-icon"><ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size: 18px;"></ha-icon></div>';
  }

  _menuHtml() {
    return `
      <div class="jules-menu">
        <div class="jules-menu-item" data-action="open">Открыть в Jules</div>
        <div class="jules-menu-item" data-action="refresh">Обновить данные</div>
      </div>`;
  }

  _attachEvents() {
    const chevron = this.card.querySelector("[data-chevron]");
    if (chevron) {
      chevron.addEventListener("click", () => {
        this._collapsed = !this._collapsed;
        this._render();
      });
    }

    this.card.querySelectorAll("[data-menu]").forEach((el) => {
      el.addEventListener("click", (ev) => this._toggleMenu(Number(el.dataset.menu), ev));
    });

    const backdrop = this.card.querySelector("[data-backdrop]");
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        this._menuFor = null;
        this._render();
      });
    }

    this.card.querySelectorAll(".jules-menu-item").forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._menuFor = null;
        if (el.dataset.action === "open") this._openJules();
        if (el.dataset.action === "refresh") this._refreshData();
        this._render();
      });
    });

    this.card.querySelectorAll(".session-item").forEach((el) => {
      el.addEventListener("click", (ev) => {
        if (ev.target.closest("[data-menu]") || ev.target.closest(".jules-menu")) return;
        this._openJules();
      });
    });
  }

  _escape(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  getCardSize() {
    return 4;
  }

  getStubConfig() {
    return { type: "custom:jules-agent-card" };
  }
}

customElements.define("jules-agent-card", JulesAgentCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "jules-agent-card",
  name: "Jules Agent Card",
  preview: true,
  description: "Dashboard card for monitoring and controlling the Jules Agent",
});
