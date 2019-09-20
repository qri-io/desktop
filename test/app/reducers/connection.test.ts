/* global describe, it, expect */
import { Reducer } from 'redux-testkit'
import ConnectionReducer, {
  initialState,
  FAILED_TO_FETCH,
  maxFailedFetches
} from '../../../app/reducers/connection'
import { apiActionTypes } from '../../../app/utils/actionType'

describe('Connection Reducer', () => {
  it('should have an initialState (@@INIT)', () => {
    expect(ConnectionReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  const [API_REQ, API_SUCC, API_FAIL] = apiActionTypes('test')

  // INITIAL STATE
  const casesInitialState = [
    {
      description: 'action type is not api',
      type: 'NOT_API',
      expect: initialState
    },
    {
      description: 'action type is REQUEST type',
      type: API_REQ,
      expect: initialState
    },
    {
      description: 'action type is FAILURE type',
      type: API_FAIL,
      expect: initialState
    },
    {
      description: 'action type is SUCCESS type',
      type: API_SUCC,
      expect: { 
        ...initialState,
        apiConnection: 1
      }
    },
    {
      description: 'action type FAILED_TO_FETCH',
      type: FAILED_TO_FETCH,
      expect: { 
        ...initialState,
        failedToFetchCount: 1
      }
    },
  ]

  casesInitialState.forEach( c => {
    it(`case initial state & ${c.description}`, () => {
      Reducer(ConnectionReducer).withState(initialState).expect({type: c.type}).toReturnState(c.expect)
    })
  })

  // STATE HAS APICONNECTION === 1
  const stateWithConnection = {
    apiConnection: 1,
    failedToFetchCount: 0
  }

  const casesStateWithConnection = [
    {
      description: 'action type is not api',
      type: 'NOT_API',
      expect: stateWithConnection
    },
    {
      description: 'action type is REQUEST type',
      type: API_REQ,
      expect: stateWithConnection
    },
    {
      description: 'action type is FAILURE type',
      type: API_FAIL,
      expect: stateWithConnection
    },
    {
      description: 'action type is SUCCESS type',
      type: API_SUCC,
      expect: stateWithConnection
    },
    {
      description: 'action type FAILED_TO_FETCH',
      type: FAILED_TO_FETCH,
      expect: { 
        ...stateWithConnection,
        failedToFetchCount: 1
      }
    },
  ]

  casesStateWithConnection.forEach( c => {
    it(`case apiConnection === 1 & ${c.description}`, () => {
      Reducer(ConnectionReducer).withState(stateWithConnection).expect({type: c.type}).toReturnState(c.expect)
    })
  })

  // STATE HAS APICONNECTION === -1
  const stateNoConnection = {
    apiConnection: -1,
    failedToFetchCount: 0
  }

  const casesStateNoConnection = [
    {
      description: 'action type is not api',
      type: 'NOT_API',
      expect: stateNoConnection
    },
    {
      description: 'action type is REQUEST type',
      type: API_REQ,
      expect: stateNoConnection
    },
    {
      description: 'action type is FAILURE type',
      type: API_FAIL,
      expect: stateNoConnection
    },
    {
      description: 'action type is SUCCESS type',
      type: API_SUCC,
      expect: {
        ...stateNoConnection,
        apiConnection: 1
      }
    },
    {
      description: 'action type FAILED_TO_FETCH',
      type: FAILED_TO_FETCH,
      expect: stateNoConnection
    },
  ]

  casesStateNoConnection.forEach( c => {
    it(`case apiConnection === -1 & ${c.description}`, () => {
      Reducer(ConnectionReducer).withState(stateNoConnection).expect({type: c.type}).toReturnState(c.expect)
    })
  })

  // STATE HAS APICONNECTION === 0 && failedToFetchCount is max
  const stateMaxFails = {
    apiConnection: 0,
    failedToFetchCount: maxFailedFetches
  }

  const casesStateMaxFails = [
    {
      description: 'action type is not api',
      type: 'NOT_API',
      expect: stateMaxFails
    },
    {
      description: 'action type is REQUEST type',
      type: API_REQ,
      expect: stateMaxFails
    },
    {
      description: 'action type is FAILURE type',
      type: API_FAIL,
      expect: stateMaxFails
    },
    {
      description: 'action type is SUCCESS type',
      type: API_SUCC,
      expect: {
        apiConnection: 1,
        failedToFetchCount:0
      }
    },
    {
      description: 'action type FAILED_TO_FETCH',
      type: FAILED_TO_FETCH,
      expect: {
        apiConnection: -1,
        failedToFetchCount: 0
      }
    },
  ]

  casesStateMaxFails.forEach( c => {
    it(`case max failed fetches & ${c.description}`, () => {
      Reducer(ConnectionReducer).withState(stateMaxFails).expect({type: c.type}).toReturnState(c.expect)
    })
  })
})
