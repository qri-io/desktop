// if we are targeting the remote build & we are in prod mode, we want the
// backend url to be the url that the user is viewing the webapp from
// otherwise, we are trying to talk to the local qri backen
import { PORT } from '../constants'
export const BACKEND_URL = process.env.NODE_ENV === 'production' && __BUILD__.REMOTE ? window.location.origin : `http://localhost:${PORT}`