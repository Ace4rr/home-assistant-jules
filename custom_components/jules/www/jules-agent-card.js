const SAMPLE_SOURCES = [
  { id: "sample/src-al", title: "Ace4rr/AL_Challenge_Banking-PSBxMAI", repo: "Ace4rr/AL_Challenge_Banking-PSBxMAI", branch: "main" },
  { id: "sample/src-ha", title: "Ace4rr/home-assistant-jules", repo: "Ace4rr/home-assistant-jules", branch: "main" },
  { id: "sample/src-rover", title: "Ace4rr/Rover_0", repo: "Ace4rr/Rover_0", branch: "main" },
  { id: "sample/src-tw", title: "Ace4rr/Twitch-CS2-case-opener", repo: "Ace4rr/Twitch-CS2-case-opener", branch: "main" },
];

const SAMPLE_SESSIONS = [
  { id: "sample/s1", title: "Допиливание ReadMe чтобы оно точно соответствовало проекту", state: "COMPLETED", updateTime: "", source_id: "sample/src-ha" },
  { id: "sample/s2", title: "Замена Bun на лего-весний аналог", state: "AWAITING_YOUR_INPUT", updateTime: "", source_id: "sample/src-tw" },
  { id: "sample/s3", title: "Ошибка custom element: jules-agent-card в Home Assistant", state: "COMPLETED", updateTime: "", source_id: "sample/src-ha" },
  { id: "sample/s4", title: "Fix register_static_path AttributeError in Jules Agent", state: "COMPLETED", updateTime: "", source_id: "sample/src-ha" },
  { id: "sample/s5", title: "Docker Compose файл для запуска инструмента", state: "COMPLETED", updateTime: "", source_id: "sample/src-ha" },
  { id: "sample/s6", title: "Рефакторизация и профессиональное оформление", state: "COMPLETED", updateTime: "", source_id: "sample/src-ha" },
  { id: "sample/s7", title: "Привет там указано про то что надо добавить сущность", state: "PAUSED", updateTime: "", source_id: "sample/src-ha" },
];

const SAMPLE_SUGGESTIONS = [
  "Missing tests for JulesTaskSensor",
  "Untested API url formatting edge case",
  "Missing tests for JulesApiClient",
];

const SAMPLE_SCHEDULED = [
  { title: "Допиливание ReadMe чтобы оно точно соответствовало проекту - какую-то фигня с Licenses", when: "Once on 2026-10-30 at 03:00 AM" },
  { title: "Напиши readme по типу как в https://github.com/meshtastic/home-assistant", when: "Once on 2026-10-26 at 11:30 AM" },
];

const SAMPLE_MESSAGES = [
  { role: "jules", kind: "message", text: "Все изменения закоммичены. Я перевел проект с bun на npm, как вы и просили:\n\n1. Заменил bun на npm (включая команды, bun.lock удалён, добавлен package-lock.json).\n2. Отредактировал скрипты на использование стандартного CLI вместо bun:sqllite и обновил конфигурацию ESLint.\n3. Переписал Dockerfile для использования node:20-alpine и npm.\n4. Обновил документацию (README, GuideView).\n5. Тестовая сборка npm run build и запуск приложения npm run start успешно проходят локально." },
  { role: "user", kind: "message", text: "Могу ли я считать эту задачу успешно завершенной?" },
  { role: "jules", kind: "message", text: "Да, задача выполнена. Все изменения закоммичены в текущей ветке (jules-6624644291350414200-a471c40f)." },
  { role: "user", kind: "message", text: "Сделай pull request, я смерджу и тогда да" },
  { role: "jules", kind: "message", text: "Я отправил изменения в репозиторий. Пожалуйста, создайте Pull Request из ветки jules-6624644291350414200-a471c40f в main. Как только вы его смерджите, дайте мне знать, и я завершу задачу." },
  { role: "jules", kind: "mcp", text: "MCP Call  connect  Render" },
  { role: "jules", kind: "message", text: "Я отправил пуш и запрос на создание пулл-реквеста через специальный внутренний API. Проверьте, пожалуйста, появился ли pull-реквест в вашем репозитории." },
];

const GH_SVG = '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

function julesEscape(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function julesRelTime(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 31) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

class JulesAgentCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._view = { type: "repo", source: null };
    this._sidebarOpen = true;
    this._search = "";
    this._sessionsExpanded = false;
    this._menuFor = null;
    this._repoMenuOpen = false;
    this._tab = "overview";
    this._hiddenSources = [];
    this._pending = [];
    this._taskDraft = "";
    this._chatDraft = "";
    this._renderKey = "";
    this._focus = null;
    this._ro = null;
  }

  setConfig(config) {
    if (config && typeof config !== "object") throw new Error("Invalid configuration");
    this.config = {
      url: "https://jules.google.com",
      sessions_entity: "sensor.jules_sessions",
      chat_entity: "sensor.jules_chat",
      status_entity: "sensor.jules_agent_status",
      task_entity: "sensor.jules_current_task",
      ...config,
    };
    this._renderKey = "";
    if (!this.isConnected) return;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.config) return;
    const key = this._dataKey();
    if (key !== this._renderKey) {
      this._pending = [];
      this._renderKey = key;
      this._render();
    }
  }

  connectedCallback() {
    if (!this._ro && typeof ResizeObserver === "function") {
      this._ro = new ResizeObserver(() => this._updateWidthClass());
      this._ro.observe(this);
    }
  }

  disconnectedCallback() {
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
  }

  _updateWidthClass() {
    if (!this.card) return;
    this.card.classList.toggle("narrow", this.card.clientWidth < 620);
  }

  _attrs(entityId) {
    const st = this._hass && this._hass.states ? this._hass.states[entityId] : null;
    return st && st.attributes ? st.attributes : {};
  }

  _data() {
    const sAttrs = this._attrs(this.config.sessions_entity);
    const cAttrs = this._attrs(this.config.chat_entity);
    const sessions = Array.isArray(sAttrs.sessions) && sAttrs.sessions.length ? sAttrs.sessions : SAMPLE_SESSIONS;
    const sources = Array.isArray(sAttrs.sources) && sAttrs.sources.length ? sAttrs.sources : SAMPLE_SOURCES;
    const chat = {
      id: cAttrs.session_id || null,
      title: cAttrs.title || "",
      messages: Array.isArray(cAttrs.messages) ? cAttrs.messages : [],
    };
    return { sessions, sources, chat };
  }

  _dataKey() {
    const d = this._data();
    const c = this._hass && this._hass.states ? this._hass.states[this.config.chat_entity] : null;
    return JSON.stringify([
      d.sessions.map((s) => [s.id, s.state, s.updateTime]),
      d.sources.map((s) => [s.id, s.title]),
      c ? c.state : null,
      d.chat.messages.length,
      this._view, this._menuFor, this._repoMenuOpen, this._tab,
      this._search, this._sessionsExpanded, this._sidebarOpen,
      this._taskDraft, this._chatDraft, this._pending.length,
    ]);
  }

  _isSample(id) {
    return typeof id === "string" && id.startsWith("sample/");
  }

  _openChat(session) {
    this._menuFor = null;
    this._view = { type: "chat", id: session.id, title: session.title };
    if (!this._isSample(session.id) && this._hass && this._hass.callService) {
      this._hass.callService("jules", "load_chat", { session_id: session.id });
    }
    this._render();
  }

  _openRepo(source) {
    this._menuFor = null;
    this._repoMenuOpen = false;
    this._view = { type: "repo", source: source ? source.id : null };
    this._render();
  }

  _openJules(session) {
    const short = String(session.id || "").replace(/^.*\//, "");
    window.open(this._isSample(session.id) ? this.config.url : `${this.config.url}/session/${short}`, "_blank");
  }

  _refresh() {
    if (this._hass && this._hass.callService) {
      this._hass.callService("homeassistant", "update_entity", {
        entity_id: [this.config.sessions_entity, this.config.chat_entity,
          this.config.status_entity, this.config.task_entity],
      });
    }
  }

  _sendTask(source) {
    const input = this.card.querySelector("[data-task-input]");
    const text = (input ? input.value : this._taskDraft).trim();
    if (!text) return;
    this._taskDraft = "";
    if (source && !this._isSample(source.id) && this._hass.callService) {
      this._hass.callService("jules", "create_session", { source_id: source.id, prompt: text });
    }
    this._render();
  }

  _sendChatMessage() {
    const input = this.card.querySelector("[data-chat-input]");
    const text = (input ? input.value : this._chatDraft).trim();
    if (!text) return;
    this._chatDraft = "";
    const id = this._view.id;
    if (id && !this._isSample(id) && this._hass.callService) {
      this._hass.callService("jules", "send_message", { session_id: id, text });
      this._pending.push({ role: "user", kind: "message", text });
    }
    this._render();
    const box = this.card.querySelector(".jules-chat-scroll");
    if (box) box.scrollTop = box.scrollHeight;
  }

  _visibleSessions(d) {
    const q = this._search.toLowerCase();
    let list = d.sessions;
    if (this._view.type === "repo" && this._view.source) {
      list = list.filter((s) => s.source_id === this._view.source);
    }
    if (q) list = list.filter((s) => (s.title || "").toLowerCase().includes(q));
    return list;
  }

  _render() {
    if (!this.config) return;

    if (!this.card) {
      this.card = document.createElement("ha-card");
      this.card.classList.add("jules-app");
      this.appendChild(this.card);
      this._updateWidthClass();
    }

    const d = this._data();
    const currentSource = d.sources.find((s) => s.id === this._view.source) || null;
    this._visibleSessions(d);

    this.card.innerHTML = `
      <style>${this._styles()}</style>
      ${this._sidebarHtml(d)}
      ${this._view.type === "repo" ? this._repoHtml(d, currentSource) : this._chatHtml(d)}
    `;

    this._appendMenu(d);
    this._attachEvents(d);
    this._updateWidthClass();
    this._restoreFocus();
    if (this._view.type === "chat") {
      const box = this.card.querySelector(".jules-chat-scroll");
      if (box) box.scrollTop = box.scrollHeight;
    }
  }

  _restoreFocus() {
    if (!this._focus) return;
    const el = this.card.querySelector(`[data-focus="${this._focus}"]`);
    if (el) {
      el.focus();
      const v = this._focus === "search" ? this._search
        : this._focus === "task" ? this._taskDraft : this._chatDraft;
      try { el.setSelectionRange(v.length, v.length); } catch (e) { /* not a text field */ }
    }
    this._focus = null;
  }

  _styles() {
    return `
      :host { display: block; }
      .jules-app {
        position: relative; display: flex; overflow: hidden;
        background: #131314; color: #e3e3e3; border-radius: 16px;
        font-family: 'Google Sans', Roboto, system-ui, -apple-system, sans-serif;
        min-height: 540px; height: 640px;
      }
      .jules-app a { color: inherit; text-decoration: none; }
      /* ---------- sidebar ---------- */
      .jules-sidebar {
        width: 250px; flex: none; display: flex; flex-direction: column;
        background: #1b1c1e; transition: margin-left .2s;
      }
      .jules-app.side-hidden .jules-sidebar { margin-left: -250px; }
      .jules-app.narrow .jules-sidebar {
        position: absolute; inset: 0 auto 0 0; z-index: 40;
        box-shadow: 8px 0 24px rgba(0,0,0,.5); margin-left: -250px !important;
      }
      .jules-app.narrow.side-open .jules-sidebar { margin-left: 0 !important; }
      .jules-side-head {
        display: flex; align-items: center; gap: 8px;
        background: #715cd7; padding: 14px 12px 14px 16px; color: #fff;
      }
      .jules-logo { font-size: 20px; font-weight: 600; letter-spacing: .2px; flex: 1; display: flex; align-items: center; gap: 8px; }
      .jules-logo ha-icon { --mdc-icon-size: 22px; }
      .jules-iconbtn {
        display: flex; align-items: center; justify-content: center;
        width: 32px; height: 32px; border-radius: 50%; cursor: pointer; flex: none;
        color: inherit; background: transparent; transition: background .15s;
      }
      .jules-iconbtn:hover { background: rgba(255,255,255,.14); }
      .jules-iconbtn.dark:hover { background: rgba(255,255,255,.08); }
      .jules-search {
        margin: 12px; padding: 0 12px; display: flex; align-items: center; gap: 8px;
        background: #2a2b2e; border-radius: 12px; height: 40px; flex: none;
      }
      .jules-search input {
        flex: 1; background: transparent; border: none; outline: none;
        color: #e3e3e3; font-size: 13.5px; font-family: inherit; min-width: 0;
      }
      .jules-search input::placeholder { color: #8e918f; }
      .jules-side-scroll { overflow-y: auto; flex: 1; padding-bottom: 12px; }
      .jules-sec {
        display: flex; align-items: center; justify-content: space-between;
        color: #9aa0a6; font-size: 13px; padding: 8px 16px 6px; cursor: pointer;
      }
      .jules-sec:hover { color: #c4c7c5; }
      .jules-row {
        display: flex; align-items: center; gap: 10px;
        padding: 7px 10px 7px 16px; margin: 1px 6px 1px 6px; border-radius: 10px;
        font-size: 13.5px; cursor: pointer; color: #c4c7c5;
      }
      .jules-row:hover { background: #26272a; }
      .jules-row.sel { background: #2a2b2e; color: #e3e3e3; }
      .jules-row .t { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
      .jules-row ha-icon, .jules-row svg { flex: none; color: #8e918f; }
      .jules-row .cnt {
        flex: none; background: #3c4043; color: #c4c7c5; border-radius: 10px;
        font-size: 11px; padding: 1px 7px;
      }
      .jules-viewmore { color: #9aa0a6; font-size: 13.5px; }
      .jules-viewmore:hover { color: #e3e3e3; }
      .jules-row.dim { opacity: .55; }
      /* ---------- main ---------- */
      .jules-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
      .jules-main-scroll { overflow-y: auto; flex: 1; }
      .jules-topbar {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 16px 4px; gap: 8px;
      }
      .jules-repo-chip {
        display: flex; align-items: center; gap: 8px; cursor: pointer;
        background: #1e1f20; border-radius: 10px; padding: 8px 12px;
        font-size: 13.5px; color: #e3e3e3; max-width: 70%;
      }
      .jules-repo-chip:hover { background: #26272a; }
      .jules-repo-chip .t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .jules-conf { display: flex; align-items: center; gap: 6px; color: #9aa0a6; font-size: 13px; cursor: pointer; flex: none; }
      .jules-conf:hover { color: #e3e3e3; }
      .jules-taskbox {
        margin: 12px 16px; display: flex; align-items: center; gap: 10px;
        background: #1e1f20; border-radius: 14px; padding: 6px 6px 6px 16px;
      }
      .jules-taskbox input {
        flex: 1; background: transparent; border: none; outline: none;
        color: #e3e3e3; font-size: 14.5px; font-family: inherit; min-width: 0;
      }
      .jules-taskbox input::placeholder, .jules-chat-input input::placeholder { color: #8e918f; }
      .jules-sendbtn {
        flex: none; display: flex; align-items: center; justify-content: center;
        width: 38px; height: 34px; border-radius: 10px; background: #333537;
        color: #c4c7c5; cursor: pointer;
      }
      .jules-sendbtn:hover { background: #3c4043; }
      .jules-tabs { display: flex; gap: 4px; padding: 4px 16px 10px; }
      .jules-tab {
        padding: 7px 14px; border-radius: 999px; font-size: 13px; cursor: pointer; color: #9aa0a6;
      }
      .jules-tab:hover { color: #e3e3e3; }
      .jules-tab.on { background: #333537; color: #e3e3e3; }
      .jules-panel {
        background: #1b1c1e; border-radius: 16px; margin: 0 16px 14px; padding: 14px 4px 6px;
      }
      .jules-panel-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 14px 10px; font-size: 14px; color: #e3e3e3; gap: 8px;
      }
      .jules-panel-head .l { display: flex; align-items: center; gap: 10px; min-width: 0; }
      .jules-panel-head .sub { color: #9aa0a6; font-size: 12.5px; cursor: pointer; flex: none; }
      .jules-panel-head .sub:hover { color: #e3e3e3; }
      .jules-chips { display: flex; gap: 8px; padding: 0 14px 12px; flex-wrap: wrap; }
      .jules-chip {
        display: flex; align-items: center; gap: 6px; font-size: 12.5px;
        background: #2a2b2e; border-radius: 999px; padding: 6px 12px; cursor: pointer; color: #c4c7c5;
      }
      .jules-chip:hover { background: #333537; }
      .jules-chip.on { background: #3c4043; }
      .jules-item {
        display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer;
      }
      .jules-item:hover { background: #222326; }
      .jules-item .t { flex: 1; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
      .jules-item .s {
        flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0;
      }
      .jules-item .s .t { white-space: normal; }
      .jules-item .sub {
        display: flex; align-items: center; gap: 6px; color: #9aa0a6; font-size: 12.5px;
      }
      .jules-badge {
        flex: none; font-size: 12px; color: #c4c7c5; border: 1px solid #5f6368;
        border-radius: 8px; padding: 2px 10px;
      }
      .jules-dots {
        flex: none; display: flex; align-items: center; justify-content: center;
        width: 30px; height: 30px; border-radius: 50%; color: #9aa0a6; cursor: pointer;
      }
      .jules-dots:hover { background: rgba(255,255,255,.08); }
      .jules-startbtn {
        flex: none; background: #e3e3e3; color: #1b1c1e; font-size: 12.5px; font-weight: 500;
        border-radius: 999px; padding: 6px 14px; cursor: pointer;
      }
      .jules-startbtn:hover { background: #fff; }
      .jules-pencil {
        flex: none; display: flex; align-items: center; justify-content: center;
        width: 30px; height: 30px; border-radius: 50%; background: #715cd7; color: #fff; cursor: pointer;
      }
      .jules-pencil:hover { filter: brightness(1.1); }
      .jules-x { flex: none; color: #9aa0a6; cursor: pointer; width: 24px; text-align: center; }
      .jules-x:hover { color: #e3e3e3; }
      .jules-bars { flex: none; color: #34a853; display: flex; align-items: flex-end; gap: 2px; height: 14px; }
      .jules-bars i { width: 3px; background: #34a853; border-radius: 1px; display: block; }
      /* ---------- menu ---------- */
      .jules-menu {
        position: fixed; z-index: 60; min-width: 190px; padding: 6px 0;
        background: #2d2f31; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,.5);
      }
      .jules-menu-item { padding: 10px 16px; font-size: 13.5px; cursor: pointer; white-space: nowrap; }
      .jules-menu-item:hover { background: #3c4043; }
      .jules-backdrop { position: fixed; inset: 0; z-index: 50; background: transparent; }
      /* ---------- chat ---------- */
      .jules-chat { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
      .jules-chat-top { padding: 12px 16px 8px; display: flex; align-items: flex-start; gap: 10px; }
      .jules-chat-top .gh { color: #c4c7c5; display: flex; margin-top: 2px; }
      .jules-chat-top .r { font-size: 13.5px; color: #9aa0a6; }
      .jules-chat-top .ti { font-size: 14.5px; color: #e3e3e3; margin-top: 2px; }
      .jules-chat-scroll { flex: 1; overflow-y: auto; padding: 8px 0 12px; }
      .jules-banner {
        display: flex; align-items: center; gap: 10px; margin: 4px 16px 8px;
        background: rgba(245,166,35,.14); color: #f5a623; border-radius: 10px;
        padding: 10px 12px; font-size: 13px;
      }
      .jules-banner .t { flex: 1; }
      .jules-msgs { max-width: 720px; margin: 0 auto; padding: 0 16px; display: flex; flex-direction: column; gap: 12px; }
      .jules-msg { display: flex; gap: 10px; }
      .jules-msg .av { flex: none; width: 26px; color: #c4c7c5; padding-top: 6px; }
      .jules-msg .bubble {
        background: #2a2b2e; border-radius: 14px; padding: 12px 16px;
        font-size: 13.5px; line-height: 1.55; white-space: pre-wrap; word-break: break-word;
        max-width: 85%;
      }
      .jules-msg.user { justify-content: flex-end; }
      .jules-msg.user .bubble { background: #333537; }
      .jules-msg .mcpcall {
        display: flex; align-items: center; gap: 10px; background: #1e1f20;
        border-radius: 12px; padding: 12px 16px; font-size: 13.5px; width: 100%;
      }
      .jules-msg .mcpcall b { font-weight: 600; }
      .jules-msg .mcpcall .k { color: #9aa0a6; }
      .jules-chat-input {
        display: flex; align-items: center; gap: 8px; margin: 0 16px 8px;
        background: #1e1f20; border-radius: 999px; padding: 6px 8px 6px 16px;
      }
      .jules-chat-input input {
        flex: 1; background: transparent; border: none; outline: none;
        color: #e3e3e3; font-size: 14px; font-family: inherit; min-width: 0;
      }
      .jules-chat-foot {
        text-align: center; color: #8e918f; font-size: 11.5px; padding: 2px 12px 10px;
      }
      .jules-chat-foot a { text-decoration: underline; cursor: pointer; }
      .jules-time { text-align: center; color: #8e918f; font-size: 12px; margin: 6px 0; }
      .jules-empty { color: #8e918f; text-align: center; padding: 40px 20px; font-size: 13.5px; }
      .jules-spinner {
        width: 14px; height: 14px; border-radius: 50%; flex: none;
        border: 2px solid rgba(138,180,248,.25); border-top-color: #8ab4f8;
        animation: jules-spin 1s linear infinite;
      }
      @keyframes jules-spin { to { transform: rotate(360deg); } }
    `;
  }

  _icon(name, size) {
    return `<ha-icon icon="mdi:${name}" style="--mdc-icon-size:${size || 18}px;"></ha-icon>`;
  }

  _stateIcon(state, size) {
    switch (state) {
      case "IN_PROGRESS":
      case "QUEUED":
        return '<div class="jules-spinner"></div>';
      case "AWAITING_YOUR_INPUT":
        return this._icon("alert-circle-outline", size || 16);
      case "PAUSED":
        return this._icon("pause-circle-outline", size || 16);
      case "FAILED":
        return this._icon("close-circle-outline", size || 16);
      default:
        return this._icon("check-circle-outline", size || 16);
    }
  }

  _stateText(state) {
    const map = {
      IN_PROGRESS: "In progress",
      QUEUED: "Queued",
      AWAITING_YOUR_INPUT: "Waiting for your input",
      PAUSED: "Paused",
      FAILED: "Failed",
      COMPLETED: "Completed",
    };
    return map[state] || state || "Completed";
  }

  _sidebarHtml(d) {
    const q = this._search.toLowerCase();
    const sessions = d.sessions
      .filter((s) => !q || (s.title || "").toLowerCase().includes(q));
    const shown = this._sessionsExpanded ? sessions : sessions.slice(0, 6);
    const repoCounts = {};
    d.sessions.forEach((s) => {
      if (s.source_id) repoCounts[s.source_id] = (repoCounts[s.source_id] || 0) + 1;
    });
    const sources = d.sources.filter((src) => !this._hiddenSources.includes(src.id))
      .filter((src) => !q || (src.title || "").toLowerCase().includes(q));
    const activeSrc = this._view.type === "repo" ? this._view.source : null;

    return `
      <div class="jules-sidebar">
        <div class="jules-side-head">
          <div class="jules-logo">${this._icon("octopus", 22)}<span>jules</span></div>
          <div class="jules-iconbtn" data-action="toggle-sidebar" title="Показать/скрыть панель">
            ${this._icon("dock-to-right", 20)}
          </div>
        </div>
        <div class="jules-search">
          <input data-focus="search" placeholder="Search for repo or sessions" value="${julesEscape(this._search)}">
          ${this._icon("magnify", 18)}
        </div>
        <div class="jules-side-scroll">
          <div class="jules-sec" data-action="toggle-sessions">Recent sessions</div>
          ${shown.map((s, i) => `
            <div class="jules-row ${this._view.type === "chat" && this._view.id === s.id ? "sel" : ""}"
                 data-session="${julesEscape(s.id)}" data-idx="${i}">
              ${this._stateIcon(s.state)}
              <span class="t" title="${julesEscape(s.title)}">${julesEscape(s.title)}</span>
            </div>`).join("")}
          ${sessions.length > 6 || this._sessionsExpanded ? `
            <div class="jules-row jules-viewmore" data-action="viewmore">
              ${this._icon(this._sessionsExpanded ? "minus" : "plus", 18)}<span class="t">${this._sessionsExpanded ? "View less" : "View more"}</span>
            </div>` : ""}
          <div class="jules-sec">Codebases</div>
          ${sources.map((src) => `
            <div class="jules-row ${activeSrc === src.id && this._view.type === "repo" ? "sel" : ""}" data-source="${julesEscape(src.id)}">
              ${GH_SVG}
              <span class="t" title="${julesEscape(src.title)}">${julesEscape(src.title)}</span>
              ${repoCounts[src.id] ? `<span class="cnt">${repoCounts[src.id]}</span>` : ""}
            </div>`).join("")}
        </div>
      </div>
    `;
  }

  _repoHtml(d, currentSource) {
    const sessions = this._visibleSessions(d)
      .slice()
      .sort((a, b) => String(b.updateTime || "").localeCompare(String(a.updateTime || "")));
    const shown = this._sessionsExpanded ? sessions : sessions.slice(0, 5);
    const repoTitle = currentSource ? currentSource.repo : "All codebases";

    return `
      <div class="jules-main">
        <div class="jules-topbar">
          <div class="jules-repo-chip" data-menu="repo">
            <span class="t">${julesEscape(repoTitle)}</span> ${this._icon("chevron-down", 18)}
          </div>
          <a class="jules-conf" href="${julesEscape(this.config.url)}" target="_blank" rel="noopener">
            Configure repo ${this._icon("cog-outline", 16)}
          </a>
        </div>
        <div class="jules-taskbox">
          <input data-focus="task" data-task-input placeholder="Write task..." value="${julesEscape(this._taskDraft)}">
          <div class="jules-sendbtn" data-action="send-task" title="Start task">${this._icon("arrow-up", 18)}</div>
        </div>
        <div class="jules-tabs">
          ${[["overview", "Codebase overview"], ["suggested", "Suggested"], ["scheduled", "Scheduled"]]
            .map(([id, label]) => `<div class="jules-tab ${this._tab === id ? "on" : ""}" data-tab="${id}">${label}</div>`).join("")}
        </div>
        <div class="jules-main-scroll">
          ${this._tab !== "scheduled" ? `
          <div class="jules-panel">
            <div class="jules-panel-head">
              <div class="l">${this._icon("idea-outline", 18)}<span>Top suggestions to continuously improve your codebase</span></div>
              <span class="sub">Configure suggestions</span>
            </div>
            ${SAMPLE_SUGGESTIONS.map((s) => `
              <div class="jules-item">
                <span class="t">${julesEscape(s)}</span>
                <span class="jules-bars"><i style="height:5px"></i><i style="height:9px"></i><i style="height:14px"></i></span>
                <span class="jules-startbtn" data-suggest="${julesEscape(s)}">Start</span>
                <span class="jules-pencil">${this._icon("pencil", 15)}</span>
                <span class="jules-x" title="Dismiss">${this._icon("close", 15)}</span>
              </div>`).join("")}
          </div>` : ""}
          ${this._tab !== "suggested" && this._tab !== "scheduled" ? `
          <div class="jules-panel">
            <div class="jules-panel-head">
              <div class="l">${this._icon("swap-vertical", 18)}<span>Sessions</span></div>
            </div>
            ${shown.length ? shown.map((s, i) => `
              <div class="jules-item" data-session="${julesEscape(s.id)}" data-idx="m${i}">
                <div class="s">
                  <span class="t">${julesEscape(s.title)}</span>
                  <span class="sub">${this._stateIcon(s.state, 13)} ${julesEscape(this._stateText(s.state))}${s.updateTime ? " " + julesEscape(julesRelTime(s.updateTime)) : ""}</span>
                </div>
                ${s.state === "PAUSED" ? '<span class="jules-badge">Paused</span>' : ""}
                <span class="jules-dots" data-menu="m${i}">${this._icon("dots-horizontal", 18)}</span>
              </div>`).join("") : '<div class="jules-empty">No sessions yet. Write a task above!</div>'}
            ${sessions.length > 5 || this._sessionsExpanded ? `
              <div class="jules-item jules-viewmore" data-action="viewmore">
                <span class="t">${this._sessionsExpanded ? "View less" : "View more"}</span>
              </div>` : ""}
          </div>` : ""}
          ${this._tab === "scheduled" ? `
          <div class="jules-panel">
            <div class="jules-panel-head">
              <div class="l">${this._icon("clock-outline", 18)}<span>Scheduled</span></div>
            </div>
            ${SAMPLE_SCHEDULED.map((s, i) => `
              <div class="jules-item">
                <div class="s">
                  <span class="t">${julesEscape(s.title)}</span>
                  <span class="sub">${this._icon("chevron-right", 14)} ${julesEscape(s.when)}</span>
                </div>
                <span class="jules-dots" data-menu="s${i}">${this._icon("dots-horizontal", 18)}</span>
              </div>`).join("")}
          </div>` : ""}
        </div>
      </div>
    `;
  }

  _chatHtml(d) {
    const real = this._view.id && !this._isSample(this._view.id);
    const loaded = d.chat.id === this._view.id;
    const messages = real
      ? (loaded ? d.chat.messages : [])
      : SAMPLE_MESSAGES;
    const session = d.sessions.find((s) => s.id === this._view.id) || {};
    const state = session.state || (real ? "" : "AWAITING_YOUR_INPUT");
    const all = [...messages, ...this._pending];

    return `
      <div class="jules-chat">
        <div class="jules-chat-top">
          <div class="jules-iconbtn dark" data-action="back" title="Назад">${this._icon("arrow-left", 20)}</div>
          <span class="gh">${GH_SVG}</span>
          <div style="flex:1;min-width:0">
            <div class="r">${julesEscape(d.sources.find((s) => s.id === session.source_id)?.repo || "Jules")}</div>
            <div class="ti">${julesEscape(this._view.title || "Session")}</div>
          </div>
          <div class="jules-iconbtn dark" data-menu="ctop" title="Меню">${this._icon("dots-horizontal", 20)}</div>
        </div>
        <div class="jules-chat-scroll">
          ${state === "AWAITING_YOUR_INPUT" ? `
            <div class="jules-banner">
              ${this._icon("alert-circle-outline", 16)}
              <span class="t">Jules is waiting for your input to continue working</span>
              ${this._icon("dots-horizontal", 16)}
            </div>` : ""}
          <div class="jules-msgs">
            ${all.length ? all.map((m) => this._messageHtml(m)).join("") : `
              <div class="jules-empty">${real && !loaded ? "Loading chat..." : "No messages yet"}</div>`}
          </div>
        </div>
        <div class="jules-chat-input">
          <input data-focus="chat" data-chat-input placeholder="Talk to Jules" value="${julesEscape(this._chatDraft)}">
          <div class="jules-sendbtn" data-action="send-chat" title="Send">${this._icon("arrow-up", 18)}</div>
        </div>
        <div class="jules-chat-foot">Jules can make mistakes so double-check it and <a href="${julesEscape(this.config.url)}" target="_blank" rel="noopener">use code with caution</a></div>
      </div>
    `;
  }

  _messageHtml(m) {
    if (m.kind === "mcp") {
      return `
        <div class="jules-msg">
          <div class="mcpcall">${this._icon("account-convert-outline", 18)} <span class="k">MCP Call</span> <b>connect</b> <span>Render</span></div>
        </div>`;
    }
    if (m.kind === "plan") {
      return `
        <div class="jules-msg">
          <div class="av">${this._icon("octopus", 20)}</div>
          <div class="bubble">${julesEscape(m.text)}</div>
        </div>`;
    }
    if (m.role === "user") {
      return `<div class="jules-msg user"><div class="bubble">${julesEscape(m.text)}</div></div>`;
    }
    return `
      <div class="jules-msg">
        <div class="av">${this._icon("octopus", 20)}</div>
        <div class="bubble">${julesEscape(m.text)}</div>
      </div>`;
  }

  _appendMenu(d) {
    if (!this._menuFor) return;
    const anchor = this.card.querySelector(`[data-menu="${this._menuFor}"]`);
    if (!anchor) { this._menuFor = null; return; }
    const r = anchor.getBoundingClientRect();
    const items = this._menuItems(d, this._menuFor);
    if (!items) { this._menuFor = null; return; }
    const left = Math.max(8, r.right - 190);
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="jules-backdrop" data-action="close-menu"></div>
      <div class="jules-menu" style="left:${left}px;top:${r.bottom + 6}px">
        ${items.map((it) => `<div class="jules-menu-item" data-maction="${it.action}" data-mkey="${julesEscape(this._menuFor)}"${it.src ? ` data-msrc="${julesEscape(it.src.id)}"` : ""}>${julesEscape(it.label)}</div>`).join("")}
      </div>
    `;
    while (wrap.firstChild) this.card.appendChild(wrap.firstChild);
  }

  _menuItems(d, key) {
    if (key === "ctop") {
      return [
        { action: "openjules", label: "Открыть в Jules" },
        { action: "refresh", label: "Обновить данные" },
      ];
    }
    if (key === "repo") {
      return d.sources.map((src) => ({ action: "repo", label: src.title, src }));
    }
    const id = String(key);
    let session = null;
    if (id.startsWith("m")) {
      session = this._visibleSessions(d)
        .slice()
        .sort((a, b) => String(b.updateTime || "").localeCompare(String(a.updateTime || "")))[Number(id.slice(1))];
    } else {
      session = d.sessions[Number(id)];
    }
    if (!session) return null;
    this._menuSession = session;
    return [
      { action: "chat", label: "Открыть чат" },
      { action: "openjules", label: "Открыть в Jules" },
      { action: "refresh", label: "Обновить данные" },
    ];
  }

  _attachEvents(d) {
    const q = (sel) => this.card.querySelector(sel);
    const qa = (sel) => [...this.card.querySelectorAll(sel)];

    qa("[data-session]").forEach((el) => {
      el.addEventListener("click", (ev) => {
        if (ev.target.closest("[data-menu]")) return;
        const id = el.dataset.session;
        const session = d.sessions.find((s) => s.id === id);
        if (session) this._openChat(session);
      });
    });

    qa("[data-source]").forEach((el) => {
      el.addEventListener("click", () => {
        const src = d.sources.find((s) => s.id === el.dataset.source);
        if (src) this._openRepo(src);
      });
    });

    qa("[data-tab]").forEach((el) => {
      el.addEventListener("click", () => { this._tab = el.dataset.tab; this._render(); });
    });

    qa("[data-suggest]").forEach((el) => {
      el.addEventListener("click", () => {
        const src = d.sources.find((s) => s.id === this._view.source) || d.sources[0];
        if (src && !this._isSample(src.id) && this._hass.callService) {
          this._hass.callService("jules", "create_session", { source_id: src.id, prompt: el.dataset.suggest });
        }
      });
    });

    const search = q('[data-focus="search"]');
    if (search) {
      search.addEventListener("input", () => {
        this._search = search.value;
        this._focus = "search";
        this._render();
      });
    }

    const taskInput = q("[data-task-input]");
    if (taskInput) {
      taskInput.addEventListener("input", () => { this._taskDraft = taskInput.value; });
      taskInput.addEventListener("keydown", (ev) => { if (ev.key === "Enter") this._sendTask(d.sources.find((s) => s.id === this._view.source)); });
      taskInput.addEventListener("focus", () => { this._focus = "task"; });
    }

    const chatInput = q("[data-chat-input]");
    if (chatInput) {
      chatInput.addEventListener("input", () => { this._chatDraft = chatInput.value; });
      chatInput.addEventListener("keydown", (ev) => { if (ev.key === "Enter") this._sendChatMessage(); });
      chatInput.addEventListener("focus", () => { this._focus = "chat"; });
    }

    qa("[data-menu]").forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._menuFor = this._menuFor === el.dataset.menu ? null : el.dataset.menu;
        this._render();
      });
    });

    qa("[data-maction]").forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const action = el.dataset.maction;
        const key = el.dataset.mkey;
        this._menuFor = null;
        if (action === "refresh") this._refresh();
        else if (action === "chat") { const s = this._menuSession; if (s) this._openChat(s); }
        else if (action === "openjules") { const s = this._menuSession || { id: this._view.id }; if (s) this._openJules(s); }
        else if (action === "repo") { this._view = { type: "repo", source: el.dataset.msrc || null }; }
        this._render();
      });
    });

    const backdrop = q("[data-action='close-menu']");
    if (backdrop) backdrop.addEventListener("click", () => { this._menuFor = null; this._render(); });

    qa("[data-action]").forEach((el) => {
      const action = el.dataset.action;
      if (["close-menu"].includes(action)) return;
      el.addEventListener("click", () => {
        if (action === "toggle-sidebar") {
          if (this.card.classList.contains("narrow")) this.card.classList.toggle("side-open");
          else this.card.classList.toggle("side-hidden");
        } else if (action === "toggle-sessions") {
          this._sessionsExpanded = !this._sessionsExpanded; this._render();
        } else if (action === "viewmore") {
          this._sessionsExpanded = !this._sessionsExpanded; this._render();
        } else if (action === "back") {
          this._view = { type: "repo", source: this._view.source }; this._render();
        } else if (action === "send-task") {
          this._sendTask(d.sources.find((s) => s.id === this._view.source));
        } else if (action === "send-chat") {
          this._sendChatMessage();
        }
      });
    });
  }

  getCardSize() {
    return 10;
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
  description: "Full Jules interface: sessions, codebases and chats",
});
