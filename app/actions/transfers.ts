import { RemoteEvent } from '../models/store'
import { TRACK_VERSION_TRANSFER,
  COMPLETE_VERSION_TRANSFER,
  REMOVE_VERSION_TRANSFER
} from '../reducers/transfers'

export const trackVersionTransfer = (transfer: RemoteEvent) => {
  return {
    type: TRACK_VERSION_TRANSFER,
    transfer
  }
}

export const completeVersionTransfer = (transfer: RemoteEvent) => {
  return {
    type: COMPLETE_VERSION_TRANSFER,
    transfer
  }
}

export const removeVersionTransfer = (transfer: RemoteEvent) => {
  return {
    type: REMOVE_VERSION_TRANSFER,
    transfer
  }
}
