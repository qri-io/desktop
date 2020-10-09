/* global describe, it, expect */
import transfersReducer, {
  initialState,
  TRACK_VERSION_TRANSFER,
  COMPLETE_VERSION_TRANSFER,
  REMOVE_VERSION_TRANSFER
} from '../../../app/reducers/transfers'

describe('Transfers Reducer', () => {
  it('intial state', () => {
    expect(transfersReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  const cases = [
    {
      description: 'push version progress',
      action: {
        type: TRACK_VERSION_TRANSFER,
        transfer: {
          ref: {
            location: 'b5/world_bank_population@/ipfs/QmVersionHash',
            username: 'b5',
            name: 'world_bank_population',
            profileId: 'QmProfileID',
            path: '/ipfs/QmVersionHash'
          },
          remoteAddr: 'https://registry.qri.cloud',
          progress: [0, 100, 0, 0, 100],
          type: "push-version"
        }
      },
      expect: {
        'b5/world_bank_population@/ipfs/QmVersionHash': {
          type: 'push-version',
          ref: {
            location: 'b5/world_bank_population@/ipfs/QmVersionHash',
            username: 'b5',
            name: 'world_bank_population',
            profileId: 'QmProfileID',
            path: '/ipfs/QmVersionHash'
          },
          remoteAddr: 'https://registry.qri.cloud',
          progress: [0, 100, 0, 0, 100]
        }
      }
    },
    {
      description: 'pull version progress',
      action: {
        type: TRACK_VERSION_TRANSFER,
        transfer: {
          ref: {
            location: 'b5/world_bank_population@/ipfs/QmVersionHash',
            username: 'b5',
            name: 'world_bank_population',
            profileId: 'QmProfileID',
            path: '/ipfs/QmVersionHash'
          },
          remoteAddr: 'https://registry.qri.cloud',
          progress: [0, 100, 0, 0, 100],
          type: "pull-version"
        }
      },
      expect: {
        'b5/world_bank_population@/ipfs/QmVersionHash': {
          type: 'pull-version',
          ref: {
            location: 'b5/world_bank_population@/ipfs/QmVersionHash',
            username: 'b5',
            name: 'world_bank_population',
            profileId: 'QmProfileID',
            path: '/ipfs/QmVersionHash'
          },
          remoteAddr: 'https://registry.qri.cloud',
          progress: [0, 100, 0, 0, 100]
        }
      }
    },

    { description: 'TRACK_VERSION_TRANSFER on empty state does nothing', action: { type: TRACK_VERSION_TRANSFER, transfer: {ref: {username: 'a', name: 'b', path: 'c' }}}, expect: initialState },
    { description: 'REMOVE_VERSION_TRANSFER on empty state does nothing', action: { type: REMOVE_VERSION_TRANSFER, transfer: {ref: {username: 'a', name: 'b', path: 'c' }}}, expect: initialState },

    {
      description: 'REMOVE_VERSION_TRANSFER clears',
      action: {type: REMOVE_VERSION_TRANSFER, transfer: {ref: { username: 'a', name: 'b', path: 'c' }}},
      expect: initialState,
      initialState: {
        'a/b@c': {
          type: 'pull-version',
          ref: { username: 'a', name: 'b', path: 'c' },
          remoteAddr: 'sure',
          progress: [0, 100, 100, 100]
        }
      }
    },

    {
      description: 'tolerates malformed actions',
      action: { type: REMOVE_VERSION_TRANSFER },
      expect: initialState
    }
  ]

  cases.forEach((c) => {
    it(c.description, () => {
      const is = c.initialState || initialState
      expect(transfersReducer(is, c.action)).toEqual(c.expect)
    })
  })
})
