// these constants may be used by both the main process and frontend
// so they need to be defined as CommonJS

// if we are targeting the remote build & we are not in dev mode, we want the
// backend url to be the url that the user is viewing the webapp from
// otherwise, we are trying to talk to the local qri backend
const BACKEND_URL = __BUILD__.REMOTE && !__BUILD__.DEV ? window.location.origin : 'http://localhost:2503'
const CRASH_REPORTER_URL = 'https://crashreports.qri.io/desktop'
const DISCORD_URL = 'https://discordapp.com/invite/thkJHKj'
const GITHUB_ORG_URL = 'https://github.com/qri-io'
const QRI_CLOUD_URL = 'https://qri.cloud'
const QRI_IO_URL = 'https://qri.io'
const WEBSOCKETS_URL = 'ws://localhost:2506'
const WEBSOCKETS_PROTOCOL = 'qri-websocket'
// 3000ms is quick enough for the app to feel responsive
// but is slow enough to not trip up the backend
const DEFAULT_POLL_INTERVAL = 3000

module.exports = {
  BACKEND_URL,
  CRASH_REPORTER_URL,
  DEFAULT_POLL_INTERVAL,
  DISCORD_URL,
  GITHUB_ORG_URL,
  QRI_CLOUD_URL,
  QRI_IO_URL,
  WEBSOCKETS_URL,
  WEBSOCKETS_PROTOCOL
}
