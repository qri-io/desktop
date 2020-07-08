import { UI_SIGNOUT } from '../reducers/ui'
export * from './ui.base'

export const signout = () => {
  return {
    type: UI_SIGNOUT
  }
}
