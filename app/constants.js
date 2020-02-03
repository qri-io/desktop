const DISCORD_URL = 'https://discordapp.com/invite/thkJHKj'
const QRI_CLOUD_URL = 'https://qri.cloud'
const BACKEND_URL = 'http://localhost:2503'

// 3800ms is quick enough for the app to feel responsive
// but is slow enough to not trip up the backend
export const DEFAULT_POLL_INTERVAL = 3000

module.exports = {
  DISCORD_URL,
  QRI_CLOUD_URL,
  BACKEND_URL,
  DEFAULT_POLL_INTERVAL
}
