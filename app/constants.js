// these constants may be used by both the main process and frontend
// so they need to be defined as CommonJS
const DISCORD_URL = 'https://discordapp.com/invite/thkJHKj'
const QRI_CLOUD_URL = 'https://qri.cloud'
const BACKEND_URL = 'http://localhost:2503'
// 3000ms is quick enough for the app to feel responsive
// but is slow enough to not trip up the backend
const DEFAULT_POLL_INTERVAL = 3000

module.exports = {
  BACKEND_URL,
  DEFAULT_POLL_INTERVAL,
  DISCORD_URL,
  QRI_CLOUD_URL
}
