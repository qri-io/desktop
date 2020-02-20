import { Dispatch, AnyAction, Store } from 'redux'

import { WEBSOCKETS_URL, WEBSOCKETS_PROTOCOL } from '../constants'

import { Store as IStore } from '../models/store'
import { fetchWorkingStatus } from '../actions/api'

// wsMiddleware manages requests to connect to the qri backend via websockets
// as well as managing messages that get passed through
export const wsConnect = () => ({ type: 'WS_CONNECT' })
export const wsConnecting = () => ({ type: 'WS_CONNECTING' })
export const wsConnected = () => ({ type: 'WS_CONNECTED' })
export const wsDisconnect = () => ({ type: 'WS_DISCONNECT' })
export const wsDisconnected = () => ({ type: 'WS_DISCONNECTED' })

const socketMiddleware = () => {
  let socket: WebSocket = null

  const onOpen = (store: Store<IStore>) => (event: Event) => {
    if (socket !== null) return
    store.dispatch(wsConnect())
  }

  const onClose = (store: Store<IStore>) => () => {
    store.dispatch(wsDisconnected())
  }

  const onMessage = (store: Store<IStore>) => (event: MessageEvent) => {
    const payload = JSON.parse(event.data)
    switch (payload.Type) {
      case 'modify':
      case 'create':
      case 'remove':
        const { workingDataset } = store.getState()
        const { peername, name } = workingDataset
        // if the websocket message Username and Dsname match the peername and
        // dataset name of the dataset that is currently being viewed, fetch
        // status
        if (peername && name && peername === payload.Username && name === payload.Dsname) {
          fetchWorkingStatus()(store.dispatch, store.getState)
        }
        break
      default:
        console.log('default')
    }
  }

  // middleware
  return (store: Store<IStore>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    switch (action.type) {
      case 'WS_CONNECT':
        if (socket !== null) {
          socket.close()
        }

        // connect to the remote host
        socket = new WebSocket(WEBSOCKETS_URL, WEBSOCKETS_PROTOCOL)

        // websocket handlers
        socket.onmessage = onMessage(store)
        socket.onclose = onClose(store)
        socket.onopen = onOpen(store)

        break
      case 'WS_DISCONNECT':
        if (socket !== null) {
          socket.close()
        }
        socket = null
        console.log('websocket closed')
        break
      // case 'NEW_MESSAGE':
      //   console.log('sending a message', action.msg)
      //   socket.send(JSON.stringify({ command: 'NEW_MESSAGE', message: action.msg }))
      //   break
      default:
        return next(action)
    }
  }
}

export default socketMiddleware()
