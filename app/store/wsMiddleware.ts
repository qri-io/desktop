import { Dispatch, AnyAction, Store } from 'redux'

import { WEBSOCKETS_URL, WEBSOCKETS_PROTOCOL } from '../constants'

import IStore from '../models/store'
import { fetchWorkingDatasetDetails } from '../actions/api'
import { resetMutationsDataset, resetMutationsStatus } from '../actions/mutations'

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
        const { peername, name, status } = workingDataset
        // if the websocket message Username and Dsname match the peername and
        // dataset name of the dataset that is currently being viewed, fetch
        // status
        if (peername && name && peername === payload.Username && name === payload.Dsname && !workingDataset.isWriting && !workingDataset.isSaving) {
          const components = Object.keys(status)
          components.forEach((component: string) => {
            if (payload.Source === status[component].filepath) {
              const wsMtime = new Date(Date.parse(payload.Time))
              // if there is and mtime or if the ws mtime is older then the status mtime, don't refetch
              if (status[component].mtime && !(status[component].mtime < wsMtime)) return
              // if there is no mtime, or if the ws mtime is newer then the status mtime, fetch!
              fetchWorkingDatasetDetails()(store.dispatch, store.getState)
              store.dispatch(resetMutationsDataset())
              store.dispatch(resetMutationsStatus())
            }
          })
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
