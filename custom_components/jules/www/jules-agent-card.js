class JulesAgentCard extends HTMLElement {
  set hass(hass) {
    if (!hass || !hass.states) return;

    if (!this.content) {
      const card = document.createElement('ha-card');
      card.style.background = '#151515';
      card.style.borderRadius = '12px';
      card.style.color = '#e0e0e0';
      card.style.fontFamily = 'system-ui, -apple-system, sans-serif';

      this.content = document.createElement('div');

      const style = document.createElement('style');
      style.textContent = `
        .jules-sessions-container {
          padding: 16px;
        }
        .jules-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #a0a0a0;
          margin-bottom: 12px;
          padding-left: 8px;
        }
        .session-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 4px;
          gap: 12px;
        }
        .session-item.active {
          background-color: #2a2a35;
        }
        .session-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7c7c8a; /* Assuming gray for completed/inactive */
        }
        .session-item.active .session-icon {
          color: #8b949e; /* Placeholder, screenshot shows gray checkmark for active too */
        }
        .session-title {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .session-dots {
          color: #8b949e;
          cursor: pointer;
        }
      `;

      card.appendChild(style);
      card.appendChild(this.content);
        this.content.innerHTML = `
      <div class="jules-sessions-container">
        <div class="jules-header">
          <span>Recent sessions</span>
          <ha-icon icon="mdi:chevron-up" style="--mdc-icon-size: 20px;"></ha-icon>
        </div>

        <div class="session-item active">
          <div class="session-icon">
            <ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size: 18px;"></ha-icon>
          </div>
          <div class="session-title" id="active-task-title"></div>
          <div class="session-dots">
            <ha-icon icon="mdi:dots-horizontal" style="--mdc-icon-size: 20px;"></ha-icon>
          </div>
        </div>

        <div class="session-item">
          <div class="session-icon">
            <ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size: 18px;"></ha-icon>
          </div>
          <div class="session-title">Очистка проекта и обновление...</div>
          <div class="session-dots"></div>
        </div>

        <div class="session-item">
          <div class="session-icon">
            <ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size: 18px;"></ha-icon>
          </div>
          <div class="session-title">Исправление ошибки версии и...</div>
          <div class="session-dots"></div>
        </div>

        <div class="session-item">
          <div class="session-icon">
            <ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size: 18px;"></ha-icon>
          </div>
          <div class="session-title">README в стиле Meshtastic Ho...</div>
          <div class="session-dots"></div>
        </div>

        <div class="session-item">
          <div class="session-icon">
            <ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size: 18px;"></ha-icon>
          </div>
          <div class="session-title">Интеграция панели агентов Jul...</div>
          <div class="session-dots"></div>
        </div>

        <div class="session-item">
          <div class="session-icon">
            <ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size: 18px;"></ha-icon>
          </div>
          <div class="session-title">Удаление водяных знаков Z.ai и...</div>
          <div class="session-dots"></div>
        </div>
      </div>
    `;
      this.appendChild(card);
    }

    const statusEntityId = 'sensor.jules_agent_status';
    const taskEntityId = 'sensor.jules_current_task';

    const statusState = hass.states[statusEntityId];
    const taskState = hass.states[taskEntityId];

    const statusStr = statusState ? statusState.state : 'Unknown';
    const taskStr = taskState ? taskState.state : 'No active task';



    if (this.content) {
      const activeTitle = this.content.querySelector("#active-task-title");
      if (activeTitle) activeTitle.textContent = taskStr;
    }
}

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = config;
  }

  getCardSize() {
    return 6; // Adjusted size based on the list
  }
}

customElements.define('jules-agent-card', JulesAgentCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "jules-agent-card",
  name: "Jules Agent Card",
  preview: true,
  description: "Dashboard card for monitoring and controlling the Jules Agent"
});
