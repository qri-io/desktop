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

// ETCreatedNewFile is the event for creating a new file
const ETCreatedNewFile = "watchfs:CreatedNewFile"
// ETModifiedFile is the event for modifying a file
const ETModifiedFile = "watchfs:ModifiedFile"
// ETDeletedFile is the event for deleting a file
const ETDeletedFile = "watchfs:DeletedFile"
// ETRenamedFolder is the event for renaming a folder
// const ETRenamedFolder = "watchfs:RenamedFolder"
// ETRemovedFolder is the event for removing a folder
// const ETRemovedFolder = "watchfs:RemovedFolder"

const socketMiddleware = () => {
  let socket: WebSocket = null

  const onOpen = (store: Store<IStore>) => (event: Event) => {
    if (socket !== null) return
    store.dispatch(wsConnect())
  }

  const onClose = (store: Store<IStore>) => () => {
    store.dispatch(wsDisconnected())
  }

  const onMessage = (store: Store<IStore>) => (e: MessageEvent) => {
    try {
      const event = JSON.parse(e.data)
      switch (event.type) {
        case ETCreatedNewFile:
        case ETModifiedFile:
        case ETDeletedFile:
          const { workingDataset } = store.getState()
          const { peername, name, status } = workingDataset
          // if the websocket message Username and Dsname match the peername and
          // dataset name of the dataset that is currently being viewed, fetch
          // status
          if (peername && name && peername === event.data.Username && name === event.data.Dsname && !workingDataset.isWriting && !workingDataset.isSaving) {
            const components = Object.keys(status)
            components.forEach((component: string) => {
              if (event.data.Source === status[component].filepath) {
                const wsMtime = new Date(Date.parse(event.data.Time))
                // if there is and mtime or if the ws mtime is older then the status mtime, don't refetch
                if (status[component].mtime && !(status[component].mtime < wsMtime)) return
                // if there is no mtime, or if the ws mtime is newer then the status mtime, fetch!
                fetchWorkingDatasetDetails(peername, name)(store.dispatch, store.getState)
                store.dispatch(resetMutationsDataset())
                store.dispatch(resetMutationsStatus())
              }
            })
          }
          break
        default:
          console.log(`received websocket event: ${event.type}`)
      }
    } catch (e) {
      console.log(`error parsing websocket message: ${e}`)
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
