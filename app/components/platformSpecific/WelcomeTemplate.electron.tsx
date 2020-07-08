import { remote } from 'electron'

export const onExit = () => remote.app.quit()
