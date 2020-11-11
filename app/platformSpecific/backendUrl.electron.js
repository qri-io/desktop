const { BACKEND_PORT } = require('../constants')

const BACKEND_URL = `http://localhost:${BACKEND_PORT}`

module.exports = {
  BACKEND_URL,
  BACKEND_PORT
}
