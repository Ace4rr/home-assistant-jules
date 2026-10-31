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
  { id: "sample/s6", title: "Рефакторизация и профессиональное оформление", state: "IN_PROGRESS", updateTime: "", source_id: "sample/src-ha" },
  { id: "sample/s7", title: "Привет там указано про то что надо добавить сущность", state: "PAUSED", updateTime: "", source_id: "sample/src-ha" },
];

const SAMPLE_SCHEDULED = [
  { title: "Допиливание ReadMe чтобы оно точно соответствовало проекту - фигня с Licenses", when: "Once on 2026-10-30 at 03:00 AM" },
  { title: "Напиши readme по типу как в https://github.com/meshtastic/home-assistant", when: "Once on 2026-10-26 at 11:30 AM" },
];

const SAMPLE_CHATS = [
  [
    { role: "jules", kind: "message", text: "Все изменения закоммичены. Я перевел проект с bun на npm, как вы и просили:\n\n1. Заменил bun на npm (включая команды, bun.lock удалён, добавлен package-lock.json).\n2. Отредактировал скрипты на использование стандартного CLI вместо bun:sqllite и обновил конфигурацию ESLint.\n3. Переписал Dockerfile для использования node:20-alpine и npm.\n4. Обновил документацию (README, GuideView).\n5. Тестовая сборка npm run build и запуск npm run start успешно проходят локально." },
    { role: "user", kind: "message", text: "Могу ли я считать эту задачу успешно завершенной?" },
    { role: "jules", kind: "message", text: "Да, задача выполнена. Все изменения закоммичены в текущей ветке (jules-6624644291350414200-a471c40f)." },
    { role: "user", kind: "message", text: "Сделай pull request, я смерджу и тогда да" },
    { role: "jules", kind: "message", text: "Я отправил изменения в репозиторий. Пожалуйста, создайте Pull Request из ветки jules-6624644291350414200-a471c40f в main. Как только вы его смерджите, дайте мне знать, и я завершу задачу." },
    { role: "jules", kind: "mcp", text: "MCP Call  connect  Render" },
    { role: "jules", kind: "message", text: "Я отправил пуш и запрос на создание пулл-реквеста через специальный внутренний API. Проверьте, пожалуйста, появился ли pull-реквест в вашем репозитории." },
  ],
  [
    { role: "user", kind: "message", text: "Проверь, почему сенсор показывает unavailable после рестарта HA." },
    { role: "jules", kind: "message", text: "Разобрался: сущность создавалась до первого успешного ответа API. Я добавил состояние «unknown» до получения данных и повторную попытку настройки через 30 секунд.\n\nИзменения закоммичены в ветке jules-fix-sensor-state." },
    { role: "user", kind: "message", text: "Отлично, добавь тест на этот кейс" },
    { role: "jules", kind: "message", text: "Добавил тест test_sensor_unavailable_before_first_refresh. Все 7 тестов проходят. Нужен ли pull request?" },
  ],
  [
    { role: "user", kind: "message", text: "Собери README в стиле Meshtastic: бейджи, скриншоты, таблица параметров." },
    { role: "jules", kind: "message", text: "Готово. Обновил README: добавил бейджи HACS/релиза, таблицу сущностей и сервисов, раздел устранения неполадок.\n\nПросьба посмотреть и подтвердить." },
    { role: "jules", kind: "mcp", text: "MCP Call  push_files  github" },
    { role: "user", kind: "message", text: "Выглядит хорошо, мержу" },
    { role: "jules", kind: "message", text: "Принял, задачу закрываю." },
  ],
];

const GH_SVG = '<svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

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
    this._chatSession = null;
    this._search = "";
    this._sessionsExpanded = false;
    this._schedOpen = true;
    this._menuFor = null;
    this._menuSession = null;
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
      height: "clamp(640px, calc(100vh - 130px), 1080px)",
      ...config,
    };
    this._renderKey = "";
    if (this.isConnected) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.config) return;
    const key = this._dataKey();
    if (key !== this._renderKey) {
      this._renderKey = key;
      this._render();
    }
  }

  connectedCallback() {
    // The card is light-DOM based, so ":host" styles do not apply — set block display explicitly.
    this.style.display = "block";
    if (this.config) this._render();
  }

  disconnectedCallback() {
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
  }

  _updateWidthClass() {
    if (!this.card) return;
    this.card.classList.toggle("narrow", this.card.clientWidth < 760);
    this.card.classList.toggle("mid", this.card.clientWidth >= 760 && this.card.clientWidth < 980);
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
      error: cAttrs.error || "",
      branch: cAttrs.branch || "",
      pr: cAttrs.pr_url || "",
    };
    return { sessions, sources, chat };
  }

  _dataKey() {
    const d = this._data();
    const c = this._hass && this._hass.states ? this._hass.states[this.config.chat_entity] : null;
    return JSON.stringify([
      d.sessions.map((s) => [s.id, s.state, s.updateTime]),
      d.sources.map((s) => [s.id, s.title]),
      c ? c.state : null, d.chat.messages.length,
      this._chatSession, this._menuFor, this._search,
      this._sessionsExpanded, this._schedOpen,
    ]);
  }

  _isSample(id) {
    return typeof id === "string" && id.startsWith("sample/");
  }

  _openChat(session) {
    this._menuFor = null;
    this._chatSession = { id: session.id, title: session.title };
    if (!this._isSample(session.id) && this._hass && this._hass.callService) {
      this._hass.callService("jules", "load_chat", { session_id: session.id });
    }
    this._render();
  }

  _closeChat() {
    this._chatSession = null;
    this._pending = [];
    this._chatDraft = "";
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

  _render() {
    if (!this.config) return;

    if (!this.card) {
      this.card = document.createElement("ha-card");
      this.card.classList.add("jules-app");
      this.appendChild(this.card);
      if (!this._ro && typeof ResizeObserver === "function") {
        this._ro = new ResizeObserver(() => this._updateWidthClass());
        this._ro.observe(this.card);
      }
    }
    this.card.style.background = "#131314";
    this.card.style.borderRadius = "10px";
    this.card.style.overflow = "hidden";

    const d = this._data();

    this.card.innerHTML = `
      <style>${this._styles()}</style>
      ${this._logoRailHtml()}
      ${this._sessionsPanelHtml(d)}
      ${this._chatPanelHtml(d)}
      <div class="jules-right">
        ${this._statsPanelHtml(d)}
      </div>
    `;

    this._appendMenu(d);
    this._bindOnce();
    this._updateWidthClass();
    this._restoreFocus();
    const box = this.card.querySelector(".jp-chat-scroll");
    if (box) box.scrollTop = box.scrollHeight;
  }

  _restoreFocus() {
    if (!this._focus) return;
    const el = this.card.querySelector(`[data-focus="${this._focus}"]`);
    if (el) {
      el.focus();
      try { el.setSelectionRange(this._search.length, this._search.length); } catch (e) { /* not a text field */ }
    }
    this._focus = null;
  }

  _styles() {
    return `
      :host { display: block; }
      .jules-app {
        display: grid; grid-template-columns: 46px minmax(215px, 250px) minmax(280px, 1fr) 272px;
        gap: 10px; padding: 10px;
        background: #131314; color: #e3e3e3;
        font-family: 'Google Sans', Roboto, system-ui, -apple-system, sans-serif;
        height: ${julesEscape(this.config.height || "660px")};
      }
      .jules-app.narrow { grid-template-columns: 46px 1fr; grid-auto-rows: minmax(300px, auto); height: auto; }
      .jules-app.narrow .jules-chat, .jules-app.narrow .jules-right { grid-column: 1 / -1; }
      .jules-app.narrow .jules-right { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .jules-app.mid { grid-template-columns: 46px minmax(215px, 250px) 1fr; }
      .jules-app.mid .jules-right { grid-column: 2 / 4; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .jules-app a { color: inherit; text-decoration: none; }
      .jules-rail {
        background: #1b1c1e; border-radius: 14px; display: flex; flex-direction: column;
        align-items: center; padding: 10px 0; gap: 10px;
      }
      .jules-rail .logo {
        width: 34px; height: 34px; border-radius: 7px; background: #715cd7;
        display: flex; align-items: center; justify-content: center; color: #fff;
      }
      .jules-rail .logo ha-icon { --mdc-icon-size: 22px; }
      .jules-rail .line { flex: 1; width: 2px; border-radius: 2px; background: #26272a; }
      .jules-panel {
        background: #1b1c1e; border-radius: 8px; display: flex; flex-direction: column;
        overflow: hidden; min-width: 0; min-height: 0;
      }
      .jules-panel-head {
        flex: none; display: flex; align-items: center; gap: 8px;
        padding: 12px 14px 8px; font-size: 13.5px; color: #e3e3e3;
      }
      .jules-panel-head .t { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
      .jules-panel-head .cnt { background: #3c4043; border-radius: 10px; font-size: 11px; padding: 1px 8px; color: #c4c7c5; }
      .jules-panel-head .x {
        display: flex; align-items: center; justify-content: center;
        width: 28px; height: 28px; border-radius: 50%; color: #9aa0a6; cursor: pointer; flex: none;
      }
      .jules-panel-head .x:hover { background: rgba(255,255,255,.08); color: #e3e3e3; }
      .jules-iconbtn {
        display: flex; align-items: center; justify-content: center;
        width: 30px; height: 30px; border-radius: 50%; cursor: pointer; flex: none;
        color: #9aa0a6; background: transparent;
      }
      .jules-iconbtn:hover { background: rgba(255,255,255,.08); color: #e3e3e3; }
      .jules-search {
        flex: none; margin: 0 10px 8px; padding: 0 10px; display: flex; align-items: center; gap: 6px;
        background: #26272a; border-radius: 6px; height: 34px; color: #8e918f;
      }
      .jules-search input {
        flex: 1; background: transparent; border: none; outline: none;
        color: #e3e3e3; font-size: 13px; font-family: inherit; min-width: 0;
      }
      .jules-search input::placeholder { color: #8e918f; }
      .jules-scroll { overflow-y: auto; flex: 1; min-height: 0; padding-bottom: 8px; }
      .jules-sec {
        display: flex; align-items: center; justify-content: space-between;
        color: #9aa0a6; font-size: 12.5px; padding: 8px 14px 4px; cursor: pointer;
      }
      .jules-sec:hover { color: #c4c7c5; }
      .jules-row {
        display: flex; align-items: center; gap: 9px;
        padding: 8px 10px 8px 14px; margin: 1px 8px; border-radius: 5px;
        font-size: 13px; cursor: pointer; color: #c4c7c5;
      }
      .jules-row:hover { background: #26272a; }
      .jules-row.sel { background: #2a2b2e; color: #e3e3e3; }
      .jules-row .t { flex: 1; min-width: 0; }
      .jules-row .t .ttl { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .jules-row .t .sub {
        display: flex; align-items: center; gap: 5px; color: #8e918f; font-size: 11.5px; margin-top: 1px;
        white-space: nowrap; overflow: hidden;
      }
      .jules-row ha-icon, .jules-row svg { flex: none; color: #8e918f; }
      .jules-viewmore { color: #9aa0a6; font-size: 12.5px; }
      .jules-viewmore:hover { color: #e3e3e3; }
      .jules-dots {
        flex: none; display: flex; align-items: center; justify-content: center;
        width: 26px; height: 26px; border-radius: 50%; color: #9aa0a6; cursor: pointer; margin: 0 -4px 0 2px;
      }
      .jules-dots:hover { background: rgba(255,255,255,.08); }
      .jules-chat { display: flex; flex-direction: column; min-width: 0; min-height: 0; flex: 1; }
      .jules-chat .jules-empty { margin: auto; }
      .jp-chat-scroll { flex: 1; overflow-y: auto; min-height: 0; }
      .jules-banner {
        display: flex; align-items: center; gap: 10px; margin: 2px 12px 8px;
        background: rgba(245,166,35,.14); color: #f5a623; border-radius: 6px;
        padding: 9px 12px; font-size: 12.5px;
      }
      .jules-banner .t { flex: 1; }
      .jules-banner.err { background: rgba(242,139,130,.14); color: #f28b82; }
      .jules-msgs { max-width: 640px; margin: 0 auto; padding: 2px 14px 12px; display: flex; flex-direction: column; gap: 10px; }
      .jules-msg { display: flex; gap: 10px; }
      .jules-msg .av { flex: none; width: 24px; color: #c4c7c5; padding-top: 5px; }
      .jules-msg .bubble {
        background: #2a2b2e; border-radius: 9px; padding: 11px 14px;
        font-size: 13px; line-height: 1.55; white-space: pre-wrap; word-break: break-word;
        max-width: 85%;
      }
      .jules-msg.user { justify-content: flex-end; }
      .jules-msg.user .bubble { background: #333537; }
      .jules-msg .mcpcall {
        display: flex; align-items: center; gap: 10px; background: #1e1f20;
        border-radius: 7px; padding: 11px 14px; font-size: 13px; width: 100%;
      }
      .jules-msg .mcpcall .k { color: #9aa0a6; }
      .jules-chat-input {
        flex: none; display: flex; align-items: center; gap: 8px; margin: 0 10px 6px;
        background: #26272a; border-radius: 8px; padding: 5px 6px 5px 14px;
      }
      .jules-chat-input input {
        flex: 1; background: transparent; border: none; outline: none;
        color: #e3e3e3; font-size: 13px; font-family: inherit; min-width: 0;
      }
      .jules-chat-input input::placeholder, .jules-taskbox textarea::placeholder { color: #8e918f; }
      .jules-chat-foot { flex: none; text-align: center; color: #8e918f; font-size: 11px; padding: 0 10px 8px; }
      .jules-chat-foot a { text-decoration: underline; cursor: pointer; }
      .jules-empty { color: #8e918f; text-align: center; padding: 40px 16px; font-size: 13px; }
      .jules-empty ha-icon { --mdc-icon-size: 40px; display: block; margin: 0 auto 10px; color: #5f6368; }
      .jules-sendbtn {
        flex: none; display: flex; align-items: center; justify-content: center;
        width: 32px; height: 30px; border-radius: 6px; background: #715cd7;
        color: #fff; cursor: pointer;
      }
      .jules-sendbtn:hover { filter: brightness(1.12); }
      .jules-right { display: flex; flex-direction: column; gap: 10px; min-width: 0; min-height: 0; }
      .jules-right .jules-panel { flex: 1; }
      .jules-taskbox {
        flex: none; display: flex; flex-direction: column; gap: 8px; margin: 0 12px 4px;
      }
      .jules-taskbox select {
        background: #26272a; color: #e3e3e3; border: none; outline: none; border-radius: 6px;
        height: 34px; padding: 0 10px; font-size: 12.5px; font-family: inherit; width: 100%;
      }
      .jules-taskbox textarea {
        background: #26272a; color: #e3e3e3; border: none; outline: none; border-radius: 7px;
        padding: 10px 12px; font-size: 12.5px; font-family: inherit; resize: none;
        height: 74px; width: 100%; box-sizing: border-box;
      }
      .jules-createbtn {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        background: #715cd7; color: #fff; border-radius: 7px; padding: 8px 0;
        font-size: 13px; font-weight: 500; cursor: pointer;
      }
      .jules-createbtn:hover { filter: brightness(1.12); }
      .jules-note { color: #8e918f; font-size: 11px; padding: 0 14px 8px; }
      .jules-stat { display: flex; align-items: center; gap: 10px; padding: 5px 14px; font-size: 12.5px; color: #c4c7c5; }
      .jules-stat .l { flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0; }
      .jules-stat .barwrap { flex: 1.2; height: 6px; border-radius: 3px; background: #26272a; overflow: hidden; }
      .jules-stat .bar { height: 100%; border-radius: 3px; }
      .jules-stat .n { flex: none; width: 26px; text-align: right; color: #9aa0a6; }
      .jules-stat .src { display: flex; align-items: center; gap: 7px; min-width: 0; }
      .jules-stat .src .t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .jules-menu {
        position: fixed; z-index: 60; min-width: 185px; padding: 6px 0;
        background: #2d2f31; border-radius: 7px; box-shadow: 0 6px 20px rgba(0,0,0,.5);
      }
      .jules-menu-item { padding: 9px 15px; font-size: 13px; cursor: pointer; white-space: nowrap; }
      .jules-menu-item:hover { background: #3c4043; }
      .jules-backdrop { position: fixed; inset: 0; z-index: 50; background: transparent; }
      .jules-spinner {
        width: 13px; height: 13px; border-radius: 50%; flex: none;
        border: 2px solid rgba(138,180,248,.25); border-top-color: #8ab4f8;
        animation: jules-spin 1s linear infinite;
      }
      @keyframes jules-spin { to { transform: rotate(360deg); } }
      /* --- jules-style chat items --- */
      .jules-plan { background: #1e1f20; border-radius: 7px; padding: 2px 0; width: 100%; }
      .plan-step { display: flex; gap: 10px; align-items: flex-start; padding: 10px 14px; font-size: 13px; }
      .plan-step + .plan-step { border-top: 1px solid #26272a; }
      .plan-num { flex: none; width: 18px; height: 18px; border-radius: 50%; background: #8ab4f8; color: #131314;
        font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
      .jules-updated { font-size: 13px; color: #e3e3e3; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .file-chip { background: #26272a; border-radius: 4px; padding: 2px 7px; font-family: monospace;
        font-size: 11.5px; color: #c4c7c5; }
      .jules-state-pill { align-self: center; background: #26272a; border-radius: 999px; padding: 6px 14px;
        font-size: 12.5px; color: #c4c7c5; }
      .jules-progress-line { font-size: 13px; color: #e3e3e3; }
      .jules-mcp { display: flex; align-items: center; gap: 10px; background: #1e1f20; border-radius: 7px;
        padding: 11px 14px; font-size: 13px; width: 100%; cursor: pointer; }
      .jules-mcp .k { color: #9aa0a6; }
      .jules-mcp .chev { margin-left: auto; transition: transform .2s; color: #9aa0a6; }
      .jules-mcp.open .chev { transform: rotate(180deg); }
      .jules-review { width: 100%; background: #1e1f20; border: 1px solid #715cd7; border-radius: 7px;
        padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
      .jules-review .rv-title { font-size: 13.5px; font-weight: 500; }
      .jules-review .rv-stats { display: flex; gap: 10px; font-family: monospace; font-size: 12px; }
      .jules-review .adds { color: #34a853; }
      .jules-review .dels { color: #f28b82; }
      .jules-review .rv-files { display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
        font-size: 12.5px; color: #9aa0a6; }
      .jules-review .rv-branch { align-self: flex-start; font-family: monospace; font-size: 11.5px;
        color: #9aa0a6; background: #26272a; border-radius: 4px; padding: 3px 8px; }
      .jules-review .rv-actions { display: flex; align-items: center; gap: 12px; }
      .jules-review .rv-btn { background: #e3e3e3; color: #1b1c1e; border-radius: 6px; padding: 6px 12px;
        font-size: 12.5px; font-weight: 500; cursor: pointer; text-decoration: none; }
      .jules-review .rv-btn:hover { background: #fff; }
      .jules-review .rv-thumbs { margin-left: auto; display: flex; align-items: center; gap: 8px;
        color: #9aa0a6; font-size: 12px; cursor: pointer; }
    `;
  }

  _icon(name, size) {
    return `<ha-icon icon="mdi:${name}" style="--mdc-icon-size:${size || 16}px;"></ha-icon>`;
  }

  _stateIcon(state, size) {
    switch (state) {
      case "IN_PROGRESS":
      case "QUEUED":
        return '<div class="jules-spinner"></div>';
      case "AWAITING_YOUR_INPUT":
      case "AWAITING_USER_FEEDBACK":
        return this._icon("alert-circle-outline", size || 15);
      case "PAUSED":
        return this._icon("pause-circle-outline", size || 15);
      case "FAILED":
        return this._icon("close-circle-outline", size || 15);
      default:
        return this._icon("check-circle-outline", size || 15);
    }
  }

  _stateText(state) {
    const map = {
      IN_PROGRESS: "In progress",
      QUEUED: "Queued",
      AWAITING_YOUR_INPUT: "Waiting for your input",
      AWAITING_USER_FEEDBACK: "Waiting for your input",
      PAUSED: "Paused",
      FAILED: "Failed",
      COMPLETED: "Completed",
    };
    return map[state] || state || "Completed";
  }

  _logoRailHtml() {
    return `
      <div class="jules-rail">
        <div class="logo" title="Jules">${this._icon("octopus", 22)}</div>
        <div class="line"></div>
      </div>
    `;
  }

  _sessionsPanelHtml(d) {
    const q = this._search.toLowerCase();
    const sessions = d.sessions
      .filter((s) => !q || (s.title || "").toLowerCase().includes(q))
      .slice()
      .sort((a, b) => String(b.updateTime || "").localeCompare(String(a.updateTime || "")));
    const shown = this._sessionsExpanded ? sessions : sessions.slice(0, 7);
    const repoById = {};
    d.sources.forEach((s) => { repoById[s.id] = s; });

    return `
      <div class="jules-panel">
        <div class="jules-panel-head">
          <span class="t">Sessions</span>
          <span class="cnt">${d.sessions.length}</span>
          <span class="jules-iconbtn" data-action="refresh" title="Обновить">${this._icon("refresh", 16)}</span>
        </div>
        <div class="jules-search">
          <input data-focus="search" placeholder="Search sessions" value="${julesEscape(this._search)}">
          ${this._icon("magnify", 15)}
        </div>
        <div class="jules-scroll">
          ${shown.map((s) => {
            const repo = repoById[s.source_id];
            return `
            <div class="jules-row ${this._chatSession && this._chatSession.id === s.id ? "sel" : ""}"
                 data-session="${julesEscape(s.id)}">
              ${this._stateIcon(s.state)}
              <div class="t">
                <div class="ttl" title="${julesEscape(s.title)}">${julesEscape(s.title)}</div>
                <div class="sub">${julesEscape(this._stateText(s.state))}${s.updateTime ? " · " + julesEscape(julesRelTime(s.updateTime)) : ""}${repo ? " · " + julesEscape(repo.repo.split("/")[1] || repo.repo) : ""}</div>
              </div>
              <span class="jules-dots" data-menu="${julesEscape(s.id)}">${this._icon("dots-horizontal", 16)}</span>
            </div>`;
          }).join("")}
          ${sessions.length > 7 || this._sessionsExpanded ? `
            <div class="jules-row jules-viewmore" data-action="viewmore">
              ${this._icon(this._sessionsExpanded ? "minus" : "plus", 15)}<span class="t">${this._sessionsExpanded ? "View less" : "View more"}</span>
            </div>` : ""}
          <div class="jules-sec" data-action="toggle-sched">
            <span>Scheduled</span>
            ${this._icon(this._schedOpen ? "chevron-up" : "chevron-down", 16)}
          </div>
          ${this._schedOpen ? SAMPLE_SCHEDULED.map((s) => `
            <div class="jules-row" data-scheduled title="Открыть в Jules">
              ${this._icon("clock-outline", 15)}
              <div class="t">
                <div class="ttl" title="${julesEscape(s.title)}">${julesEscape(s.title)}</div>
                <div class="sub">${this._icon("chevron-right", 12)} ${julesEscape(s.when)}</div>
              </div>
            </div>`).join("") : ""}
        </div>
      </div>
    `;
  }

  _chatPanelHtml(d) {
    if (!this._chatSession) {
      return `
        <div class="jules-panel jules-chat">
          <div class="jules-panel-head"><span class="t">Chat</span></div>
          <div class="jules-empty">${this._icon("octopus", 40)}Select a session to open the chat</div>
        </div>
      `;
    }
    const real = !this._isSample(this._chatSession.id);
    const loaded = d.chat.id === this._chatSession.id;
    const idx = Math.max(0, d.sessions.findIndex((s) => s.id === this._chatSession.id));
    const messages = real
      ? (loaded ? d.chat.messages : [])
      : SAMPLE_CHATS[idx % SAMPLE_CHATS.length];
    const session = d.sessions.find((s) => s.id === this._chatSession.id) || {};
    const state = session.state || (real ? "" : "AWAITING_YOUR_INPUT");
    const all = [...messages];
    const repo = d.sources.find((s) => s.id === session.source_id);
    const waiting = ["AWAITING_YOUR_INPUT", "AWAITING_USER_FEEDBACK"].includes(state);

    return `
      <div class="jules-panel jules-chat">
        <div class="jules-panel-head">
          <span class="gh">${GH_SVG}</span>
          <span class="t" title="${julesEscape(this._chatSession.title)}">${julesEscape(repo ? repo.repo + " — " : "")}${julesEscape(this._chatSession.title)}</span>
          ${real ? "" : '<span class="jules-badge">demo</span>'}
          <span class="jules-iconbtn" data-action="open-jules" title="Открыть в Jules">${this._icon("open-in-new", 15)}</span>
          <span class="x" data-action="close-chat" title="Закрыть чат">${this._icon("close", 16)}</span>
        </div>
        <div class="jp-chat-scroll">
          ${d.chat.error && real && loaded ? `
            <div class="jules-banner err">
              ${this._icon("alert-circle-outline", 15)}
              <span class="t">Не удалось загрузить чат: ${julesEscape(d.chat.error)}</span>
            </div>` : ""}
          ${waiting ? `
            <div class="jules-banner">
              ${this._icon("alert-circle-outline", 15)}
              <span class="t">Jules is waiting for your input to continue working</span>
            </div>` : ""}
          <div class="jules-msgs">
            ${all.length ? all.map((m, i) => this._messageHtml(
                m,
                m.kind === "changes" && !all.slice(i + 1).some((x) => x.kind === "changes"),
                d,
              )).join("") : `
              <div class="jules-empty">${real && !loaded ? "Loading chat..." : "No messages yet"}</div>`}
          </div>
        </div>
        <div class="jules-chat-foot">Jules can make mistakes so double-check it and <a href="${julesEscape(this.config.url)}" target="_blank" rel="noopener">use code with caution</a></div>
      </div>
    `;
  }

  _messageHtml(m, isLast, d) {
    if (m.kind === "plan") {
      const steps = String(m.text).split("\n").map((s) => s.replace(/^\s*\d+\.\s*/, ""));
      return `
        <div class="jules-msg"><div class="jules-plan">
          ${steps.map((s, i) => `<div class="plan-step"><span class="plan-num">${i + 1}</span><span>${julesEscape(s)}</span></div>`).join("")}
        </div></div>`;
    }
    if (m.kind === "changes") {
      const files = Array.isArray(m.files) && m.files.length ? m.files
        : String(m.text || "").replace("Изменения кода: ", "").split(", ").filter(Boolean);
      const chips = files.map((f) => `<span class="file-chip">${julesEscape(f)}</span>`).join(" ");
      if (isLast) {
        const shortId = String(this._chatSession.id || "").replace(/^.*\//, "");
        const pr = d.chat.pr || `${this.config.url}/session/${shortId}`;
        return `
        <div class="jules-msg"><div class="jules-review">
          <div class="rv-title">Ready for review 🎉</div>
          ${m.adds || m.dels ? `<div class="rv-stats"><span class="adds">+${m.adds || 0}</span><span class="dels">−${m.dels || 0}</span></div>` : ""}
          <div class="rv-files">Updated ${chips}</div>
          ${d.chat.branch ? `<div class="rv-branch">⑂ ${julesEscape(d.chat.branch)}</div>` : ""}
          <div class="rv-actions">
            <a class="rv-btn" href="${julesEscape(pr)}" target="_blank" rel="noopener">View PR</a>
            <span class="rv-thumbs" data-action="open-jules" title="Оценить в Jules">How'd Jules do? ${this._icon("thumb-up-outline", 15)} ${this._icon("thumb-down-outline", 15)}</span>
          </div>
        </div></div>`;
      }
      return `<div class="jules-msg"><div class="jules-updated">Updated ${chips}</div></div>`;
    }
    if (m.kind === "state") {
      return `<div class="jules-msg"><div class="jules-state-pill">${julesEscape(m.text)}</div></div>`;
    }
    if (m.kind === "progress") {
      return `<div class="jules-msg"><div class="jules-progress-line">${julesEscape(m.text)}</div></div>`;
    }
    if (m.kind === "mcp") {
      return `
        <div class="jules-msg"><div class="jules-mcp" title="Подробнее в Jules">
          ${this._icon("account-convert-outline", 16)} <span class="k">MCP Call</span> <b>${julesEscape(String(m.text).replace(/^MCP Call\s*/, ""))}</b>
          <ha-icon class="chev" icon="mdi:chevron-down" style="--mdc-icon-size:16px;"></ha-icon>
        </div></div>`;
    }
    if (m.role === "user") {
      return `<div class="jules-msg user"><div class="bubble">${julesEscape(m.text)}</div></div>`;
    }
    return `
      <div class="jules-msg">
        <div class="av">${this._icon("octopus", 19)}</div>
        <div class="bubble">${julesEscape(m.text)}</div>
      </div>`;
  }

  _statsPanelHtml(d) {
    const sessions = d.sessions;
    const count = (pred) => sessions.filter(pred).length;
    const total = sessions.length;
    const stats = [
      { label: "In progress", n: count((s) => ["IN_PROGRESS", "QUEUED"].includes(s.state)), color: "#8ab4f8" },
      { label: "Waiting for input", n: count((s) => ["AWAITING_YOUR_INPUT", "AWAITING_USER_FEEDBACK"].includes(s.state)), color: "#f5a623" },
      { label: "Completed", n: count((s) => s.state === "COMPLETED"), color: "#34a853" },
      { label: "Paused", n: count((s) => s.state === "PAUSED"), color: "#9aa0a6" },
      { label: "Failed", n: count((s) => s.state === "FAILED"), color: "#f28b82" },
    ];
    const max = Math.max(1, ...stats.map((s) => s.n));
    const perRepo = {};
    sessions.forEach((s) => {
      if (s.source_id) perRepo[s.source_id] = (perRepo[s.source_id] || 0) + 1;
    });
    const repoById = {};
    d.sources.forEach((s) => { repoById[s.id] = s; });
    const times = sessions.map((s) => s.updateTime).filter(Boolean).sort();
    const last = times.length ? times[times.length - 1] : "";

    return `
      <div class="jules-panel">
        <div class="jules-panel-head">
          ${this._icon("chart-box-outline", 16)}<span class="t">Statistics</span>
        </div>
        <div class="jules-scroll">
          ${stats.map((s) => `
            <div class="jules-stat">
              <div class="l">${this._stateIcon(s.label === "In progress" ? "IN_PROGRESS" : s.label === "Waiting for input" ? "AWAITING_YOUR_INPUT" : s.label === "Completed" ? "COMPLETED" : s.label === "Paused" ? "PAUSED" : "FAILED", 14)}<span>${s.label}</span></div>
              <div class="barwrap"><div class="bar" style="width:${Math.round((s.n / max) * 100)}%;background:${s.color}"></div></div>
              <span class="n">${s.n}</span>
            </div>`).join("")}
          <div class="jules-sec">By codebase</div>
          ${Object.entries(perRepo).sort((a, b) => b[1] - a[1]).map(([srcId, n]) => {
            const repo = repoById[srcId];
            return `
            <div class="jules-stat">
              <div class="l src">${GH_SVG}<span class="t" title="${julesEscape(repo ? repo.repo : srcId)}">${julesEscape(repo ? repo.repo.split("/")[1] || repo.repo : srcId)}</span></div>
              <span class="n">${n}</span>
            </div>`;
          }).join("")}
          <div class="jules-sec">Latest activity</div>
          <div class="jules-stat">
            <div class="l">${this._icon("history", 14)}<span>${last ? julesEscape(julesRelTime(last)) : "—"}</span></div>
          </div>
        </div>
      </div>
    `;
  }

  _appendMenu(d) {
    if (!this._menuFor) return;
    const anchor = this.card.querySelector(`[data-menu="${this._menuFor}"]`);
    if (!anchor) { this._menuFor = null; return; }
    const r = anchor.getBoundingClientRect();
    const session = d.sessions.find((s) => s.id === this._menuFor);
    if (!session) { this._menuFor = null; return; }
    this._menuSession = session;
    const left = Math.max(8, r.right - 185);
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="jules-backdrop" data-action="close-menu"></div>
      <div class="jules-menu" style="left:${left}px;top:${r.bottom + 6}px">
        <div class="jules-menu-item" data-maction="chat">Открыть чат</div>
        <div class="jules-menu-item" data-maction="openjules">Открыть в Jules</div>
        <div class="jules-menu-item" data-maction="refresh">Обновить данные</div>
      </div>
    `;
    while (wrap.firstChild) this.card.appendChild(wrap.firstChild);
  }

  _bindOnce() {
    if (this._bound) return;
    this._bound = true;
    this.card.addEventListener("click", (ev) => this._handleClick(ev));
    this.card.addEventListener("input", (ev) => {
      if (!ev.target.matches) return;
      if (ev.target.matches('[data-focus="search"]')) {
        this._search = ev.target.value;
        this._focus = "search";
        this._render();
      }
    });
  }

  _handleClick(ev) {
    const d = this._data();
    const t = ev.target;

    const mcpEl = t.closest(".jules-mcp");
    if (mcpEl) {
      mcpEl.classList.toggle("open");
      return;
    }

    const maction = t.closest("[data-maction]");
    if (maction) {
      ev.stopPropagation();
      const action = maction.dataset.maction;
      this._menuFor = null;
      if (action === "refresh") this._refresh();
      else if (action === "chat" && this._menuSession) this._openChat(this._menuSession);
      else if (action === "openjules" && this._menuSession) this._openJules(this._menuSession);
      this._render();
      return;
    }

    const menuEl = t.closest("[data-menu]");
    if (menuEl) {
      ev.stopPropagation();
      this._menuFor = this._menuFor === menuEl.dataset.menu ? null : menuEl.dataset.menu;
      this._render();
      return;
    }

    const actEl = t.closest("[data-action]");
    if (actEl) {
      const action = actEl.dataset.action;
      if (action === "viewmore") {
        this._sessionsExpanded = !this._sessionsExpanded;
        this._render();
      } else if (action === "toggle-sched") {
        this._schedOpen = !this._schedOpen;
        this._render();
      } else if (action === "close-chat") {
        this._closeChat();
      } else if (action === "refresh") {
        this._refresh();
      } else if (action === "open-jules" && this._chatSession) {
        this._openJules(this._chatSession);
      } else if (action === "close-menu") {
        this._menuFor = null;
        this._render();
      }
      return;
    }

    const sessEl = t.closest("[data-session]");
    if (sessEl) {
      const session = d.sessions.find((s) => s.id === sessEl.dataset.session);
      if (session) this._openChat(session);
      return;
    }

    const schedEl = t.closest("[data-scheduled]");
    if (schedEl) {
      window.open(this.config.url, "_blank");
    }
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
  description: "Jules multi-panel interface: sessions, chats, new tasks and statistics",
});
