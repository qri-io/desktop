import { Reducer, AnyAction } from 'redux'

import { RemoteEvent, RemoteEvents } from '../models/store'
import { TRACK_VERSION_TRANSFER, COMPLETE_VERSION_TRANSFER, REMOVE_VERSION_TRANSFER } from '../actions/transfers'

export const initialState: RemoteEvents = {
  // 'b5/world_bank_population@/ipfs/QmVersionHash': {
  //   type: 'pull-version',
  //   ref: {
  //     location: 'b5/world_bank_population@/ipfs/QmVersionHash',
  //     username: 'b5',
  //     name: 'world_bank_population',
  //     profileId: 'QmProfileID',
  //     path: '/ipfs/QmVersionHash'
  //   },
  //   remoteAddress: 'https://registry.qri.cloud',
  //   progress: [0, 100, 0, 0, 100]
  // }
}

// ETRemoteClientPushVersionProgress indicates a change in progress of a
// dataset version push. Progress can fire as much as once-per-block.
// subscriptions do not block the publisher
// payload will be a RemoteEvent
export const ETRemoteClientPushVersionProgress = "remoteClient:PushVersionProgress"
// ETRemoteClientPushVersionCompleted indicates a version successfully pushed
// to a remote.
// payload will be a RemoteEvent
export const ETRemoteClientPushVersionCompleted = "remoteClient:PushVersionCompleted"
// ETRemoteClientPushDatasetCompleted indicates pushing a dataset
// (logbook + versions) completed
// payload will be a RemoteEvent
export const ETRemoteClientPushDatasetCompleted = "remoteClient:PushDatasetCompleted"
// ETRemoteClientPullVersionProgress indicates a change in progress of a
// dataset version pull. Progress can fire as much as once-per-block.
// subscriptions do not block the publisher
// payload will be a RemoteEvent
export const ETRemoteClientPullVersionProgress = "remoteClient:PullVersionProgress"
// ETRemoteClientPullVersionCompleted indicates a version successfully pulled
// from a remote.
// payload will be a RemoteEvent
export const ETRemoteClientPullVersionCompleted = "remoteClient:PullVersionCompleted"
// ETRemoteClientPullDatasetCompleted indicates pulling a dataset
// (logbook + versions) completed
// payload will be a RemoteEvent
export const ETRemoteClientPullDatasetCompleted = "remoteClient:PullDatasetCompleted"
// ETRemoteClientRemoveDatasetCompleted indicates removing a dataset
// (logbook + versions) remove completed
// payload will be a RemoteEvent
export const ETRemoteClientRemoveDatasetCompleted = "remoteClient:RemoveDatasetCompleted"

function eventID (data: RemoteEvent): string {
  return `${data.ref.username}/${data.ref.name}@${data.ref.path}`
}

function deleteOne (state: RemoteEvents, data: RemoteEvent): RemoteEvents {
  const update = { ...state }
  delete update[eventID(data)]
  return update
}

const transfersReducer: Reducer = (state = initialState, action: AnyAction): RemoteEvents => {
  if (![TRACK_VERSION_TRANSFER, COMPLETE_VERSION_TRANSFER, REMOVE_VERSION_TRANSFER].includes(action.type)) {
    return state
  }
  if (!action.transfer || !action.transfer.ref) {
    return state
  }
  let t = action.transfer

  switch (action.type) {
    // since the ID doesn't utilize any type, push and pull are equal
    case TRACK_VERSION_TRANSFER:
      if (!t.progress) {
        return state
      }
      return {
        ...state,
        [eventID(t)]: t
      }
    case COMPLETE_VERSION_TRANSFER:
    case REMOVE_VERSION_TRANSFER:
      return deleteOne(state, t)
    default:
      return state
  }
}

export default transfersReducer
