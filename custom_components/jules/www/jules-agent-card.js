class JulesAgentCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      card.header = 'Jules Agent';
      this.content = document.createElement('div');

      // Inline styles for a clean, modern look matching Jules
      const style = document.createElement('style');
      style.textContent = `
        .jules-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .status-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #721c24; /* default offline */
        }
        .status-indicator.working {
          background-color: #28a745;
          box-shadow: 0 0 8px rgba(40, 167, 69, 0.6);
        }
        .status-text {
          font-weight: bold;
          text-transform: capitalize;
        }
        .task-container {
          background-color: var(--secondary-background-color, #f4f4f4);
          padding: 12px;
          border-radius: 8px;
          font-family: monospace;
          color: var(--primary-text-color);
        }
        .actions-row {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .actions-row mwc-button {
          flex: 1;
        }
      `;

      card.appendChild(style);
      card.appendChild(this.content);
      this.appendChild(card);
    }

    // Get sensor states (assuming these entity IDs based on our python code)
    // Note: in a real environment the exact entity_id might have a suffix if multiple exist
    const statusEntityId = 'sensor.jules_agent_status';
    const taskEntityId = 'sensor.jules_current_task';

    const statusState = hass.states[statusEntityId];
    const taskState = hass.states[taskEntityId];

    const statusStr = statusState ? statusState.state : 'Unknown';
    const taskStr = taskState ? taskState.state : 'No active task';

    const isWorking = statusStr.toLowerCase() === 'working';

    this.content.innerHTML = `
      <div class="jules-container">
        <div class="status-row">
          <div class="status-indicator ${isWorking ? 'working' : ''}"></div>
          <div class="status-text">Status: ${statusStr}</div>
        </div>

        <div>Current Task:</div>
        <div class="task-container">
          ${taskStr}
        </div>

        <div class="actions-row">
          <!-- Placeholders for future interactivity -->
          <mwc-button raised label="Pause" icon="mdi:pause" ${!isWorking ? 'disabled' : ''}></mwc-button>
          <mwc-button raised label="Stop" icon="mdi:stop" ${!isWorking ? 'disabled' : ''}></mwc-button>
          <mwc-button outlined label="New Task" icon="mdi:plus"></mwc-button>
        </div>
      </div>
    `;

    // Add event listeners for placeholder buttons (for future implementation)
    const buttons = this.content.querySelectorAll('mwc-button');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.getAttribute('label');
        console.log(`Action ${action} triggered! Future API integration goes here.`);
        // Example of calling a HA service in the future:
        // hass.callService('jules', 'send_command', { command: action.toLowerCase() });
      });
    });
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = config;
  }

  getCardSize() {
    return 3;
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
