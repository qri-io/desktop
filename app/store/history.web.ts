import { createBrowserHistory } from 'history'

export const history = __BUILD__.REMOTE ? createBrowserHistory({ basename: '/webui' }) : createBrowserHistory()
