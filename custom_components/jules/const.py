"""Constants for the Jules Agent integration."""

DOMAIN = "jules"

CONF_API_URL = "api_url"
CONF_API_TOKEN = "api_token"
DEFAULT_API_URL = "https://jules.googleapis.com"

UPDATE_INTERVAL = 30  # seconds

# Attributes exposed on sensors for the Lovelace card
ATTR_SESSIONS = "sessions"
ATTR_SOURCES = "sources"
ATTR_MESSAGES = "messages"

# Services
SERVICE_LOAD_CHAT = "load_chat"
SERVICE_SEND_MESSAGE = "send_message"
SERVICE_CREATE_SESSION = "create_session"

# Jules session states
STATE_IN_PROGRESS = "IN_PROGRESS"
STATE_COMPLETED = "COMPLETED"
STATE_AWAITING_INPUT = "AWAITING_YOUR_INPUT"
STATE_PAUSED = "PAUSED"
STATE_FAILED = "FAILED"
STATE_QUEUED = "QUEUED"
