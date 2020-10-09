import { Reducer, AnyAction } from 'redux'

import { RemoteEvent, RemoteEvents } from '../models/store'

export const TRACK_VERSION_TRANSFER = 'TRACK_VERSION_TRANSFER'
export const COMPLETE_VERSION_TRANSFER = 'COMPLETE_VERSION_TRANSFER'
export const REMOVE_VERSION_TRANSFER = 'REMOVE_VERSION_TRANSFER'

// example remote event:
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
export const initialState: RemoteEvents = {}

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
  } else if (!action.transfer || !action.transfer.ref) {
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
      t.complete = true
      return {
        ...state,
        [eventID(t)]: t
      }
    case REMOVE_VERSION_TRANSFER:
      return deleteOne(state, t)
    default:
      return state
  }
}

export default transfersReducer
