export const BACKEND_URL = process.env.NODE_ENV === 'production' && __BUILD__.REMOTE ? window.location.origin : 'http://localhost:2503'

export default BACKEND_URL