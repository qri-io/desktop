import { remote } from 'electron'

export const exitLinkAttributes = {
  onClick: () => remote.app.quit()
}
