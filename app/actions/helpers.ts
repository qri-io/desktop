import { Action } from 'redux'

export interface IAction extends Action {} // eslint-disable-line
export interface IActionWithPayload<T> extends Action {
  readonly payload: T
}

interface IActionCreator<T> {
  readonly type: string
  (payload: T): IActionWithPayload<T>

  test(action: IAction): action is IActionWithPayload<T>
}

interface IActionCreatorVoid {
  readonly type: string
  (): IAction

  test(action: IAction): action is IAction
}

export const actionCreator = <T>(type: string): IActionCreator<T> =>
  Object.assign((payload: T): any => ({ type, payload }), { // eslint-disable-line
    type,
    test (action: IAction): action is IActionWithPayload<T> {
      return action.type === type
    }
  })

export const actionCreatorVoid = (type: string): IActionCreatorVoid =>
  Object.assign((): any => ({ type }), { // eslint-disable-line
    type,
    test (action: IAction): action is IAction {
      return action.type === type
    }
  })
