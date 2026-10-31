function jscEscape(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function jscRelTime(iso) {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

class JulesStatsCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._renderKey = "";
  }

  setConfig(config) {
    if (config && typeof config !== "object") throw new Error("Invalid configuration");
    this.config = {
      sessions_entity: "sensor.jules_sessions",
      url: "https://jules.google.com",
      ...config,
    };
    this._renderKey = "";
    if (this.isConnected) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.config) return;
    const st = hass && hass.states ? hass.states[this.config.sessions_entity] : null;
    const key = JSON.stringify([
      st ? st.attributes && st.attributes.sessions : null,
      st ? st.attributes && st.attributes.sources : null,
    ]);
    if (key !== this._renderKey) {
      this._renderKey = key;
      this._render();
    }
  }

  connectedCallback() {
    this.style.display = "block";
    if (this.config) this._render();
  }

  _data() {
    const st = this._hass && this._hass.states ? this._hass.states[this.config.sessions_entity] : null;
    const attrs = st && st.attributes ? st.attributes : {};
    const sessions = Array.isArray(attrs.sessions) && attrs.sessions.length ? attrs.sessions : [];
    const sources = Array.isArray(attrs.sources) && attrs.sources.length ? attrs.sources : [];
    return { sessions, sources };
  }

  _render() {
    if (!this.config) return;
    if (!this.card) {
      this.card = document.createElement("ha-card");
      this.appendChild(this.card);
      this.style.display = "block";
    }
    this.card.style.cssText = "display:block;background:#131314;border-radius:10px;overflow:hidden;color:#e3e3e3;";

    const d = this._data();
    const sessions = d.sessions;
    const count = (states) => sessions.filter((s) => states.includes(s.state)).length;
    const stats = [
      { label: "In progress", icon: "progress-clock", ic: "#9aa0a6", n: count(["IN_PROGRESS", "QUEUED"]), color: "#8ab4f8" },
      { label: "Waiting for input", icon: "alert-circle-outline", ic: "#f5a623", n: count(["AWAITING_YOUR_INPUT", "AWAITING_USER_FEEDBACK"]), color: "#f5a623" },
      { label: "Completed", icon: "check-circle-outline", ic: "#34a853", n: count(["COMPLETED"]), color: "#34a853" },
      { label: "Paused", icon: "pause-circle-outline", ic: "#9aa0a6", n: count(["PAUSED"]), color: "#9aa0a6" },
      { label: "Failed", icon: "close-circle-outline", ic: "#f28b82", n: count(["FAILED"]), color: "#f28b82" },
    ];
    const max = Math.max(1, ...stats.map((s) => s.n));
    const repoById = {};
    d.sources.forEach((s) => { repoById[s.id] = s; });
    const perRepo = {};
    sessions.forEach((s) => {
      if (s.source_id) perRepo[s.source_id] = (perRepo[s.source_id] || 0) + 1;
    });
    const times = sessions.map((s) => s.updateTime).filter(Boolean).sort();
    const last = times.length ? times[times.length - 1] : "";
    const active = sessions.filter((s) => ["IN_PROGRESS", "QUEUED", "AWAITING_YOUR_INPUT", "AWAITING_USER_FEEDBACK"].includes(s.state));

    this.card.innerHTML = `
      <style>
        .jsc { padding: 16px 16px 14px; font-family: 'Google Sans', Roboto, system-ui, sans-serif; }
        .jsc-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .jsc-head img { width: 42px; height: 42px; }
        .jsc-head .t { flex: 1; font-size: 16px; font-weight: 600; }
        .jsc-head .t small { display: block; font-weight: 400; font-size: 12px; color: #9aa0a6; margin-top: 2px; }
        .jsc-head .cnt { background: #715cd7; border-radius: 8px; padding: 5px 12px; font-size: 14px; font-weight: 600; }
        .jsc-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 13px; color: #c4c7c5; }
        .jsc-row ha-icon { --mdc-icon-size: 16px; flex: none; }
        .jsc-row .l { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .jsc-row .barwrap { flex: 1; height: 7px; border-radius: 3px; background: #26272a; overflow: hidden; }
        .jsc-row .bar { height: 100%; border-radius: 3px; }
        .jsc-row .n { flex: none; width: 26px; text-align: right; color: #9aa0a6; font-size: 13px; }
        .jsc-sec { color: #9aa0a6; font-size: 12px; padding: 14px 0 6px; }
        .jsc-src { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 13px; cursor: pointer; }
        .jsc-src:hover { color: #fff; }
        .jsc-src .t { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .jsc-src .n { color: #9aa0a6; }
        .jsc-foot { display: flex; align-items: center; gap: 8px; color: #8e918f; font-size: 12px; padding-top: 14px; }
        .jsc-empty { color: #8e918f; font-size: 13px; text-align: center; padding: 18px 0; }
      </style>
      <div class="jsc">
        <div class="jsc-head">
          <img src="/jules_local/jules-octopus.png" alt="Jules">
          <div class="t">Jules<small>${active.length ? active.length + " active task" + (active.length === 1 ? "" : "s") : "all quiet"}</small></div>
          <span class="cnt">${sessions.length}</span>
        </div>
        ${sessions.length ? stats.map((s) => `
          <div class="jsc-row">
            <ha-icon icon="mdi:${s.icon}" style="color:${s.ic};"></ha-icon>
            <span class="l">${s.label}</span>
            <div class="barwrap"><div class="bar" style="width:${Math.round((s.n / max) * 100)}%;background:${s.color}"></div></div>
            <span class="n">${s.n}</span>
          </div>`).join("") : `
          <div class="jsc-empty">Нет данных — проверьте Jules API</div>`}
        ${Object.keys(perRepo).length ? `
          <div class="jsc-sec">By codebase</div>
          ${Object.entries(perRepo).sort((a, b) => b[1] - a[1]).map(([srcId, n]) => {
            const repo = repoById[srcId];
            return `
            <div class="jsc-src" data-url="${jscEscape(this.config.url)}" title="${jscEscape(repo ? repo.repo : srcId)}">
              <span class="t">${jscEscape(repo ? repo.repo.split("/")[1] || repo.repo : srcId)}</span>
              <span class="n">${n}</span>
            </div>`;
          }).join("")}` : ""}
        <div class="jsc-foot">
          <ha-icon icon="mdi:history" style="--mdc-icon-size:14px;"></ha-icon>
          <span>Latest activity: ${sessions.length && last ? jscEscape(jscRelTime(last)) : "—"}</span>
        </div>
      </div>
    `;

    if (!this._bound) {
      this._bound = true;
      this.card.addEventListener("click", (ev) => {
        const src = ev.target.closest(".jsc-src");
        if (src && src.dataset.url) window.open(src.dataset.url, "_blank");
      });
    }
  }

  getCardSize() {
    return 5;
  }

  getStubConfig() {
    return { type: "custom:jules-stats-card" };
  }
}

customElements.define("jules-stats-card", JulesStatsCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "jules-stats-card",
  name: "Jules Stats Card",
  preview: true,
  description: "Compact Jules statistics widget with overall task statuses",
});
