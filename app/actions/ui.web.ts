import { UI_SIGNOUT } from '../reducers/ui.TARGET_PLATFORM'
export * from './ui.base'

export const signout = () => {
  return {
    type: UI_SIGNOUT
  }
}
