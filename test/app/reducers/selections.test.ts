/* global describe, it, expect */
import { Reducer } from 'redux-testkit'
import SelectionsReducer, { 
  initialState,
  SELECTIONS_SET_ACTIVE_TAB,
  SELECTIONS_SET_SELECTED_LISTITEM,
  SELECTIONS_SET_WORKING_DATASET,
  SELECTIONS_CLEAR,
  ADD_SUCC,
  INIT_SUCC,
  DATASET_SUCC,
  DATASET_FAIL,
  COMMIT_SUCC,
  PUBLISH_SUCC,
  UNPUBLISH_SUCC,
  SIGNIN_SUCC,
  SIGNUP_SUCC
} from '../../../app/reducers/selections'

// TODO (ramfox): test local storage
// TODO (ramfox): test on non-empty/not initialState
describe('Body Reducer', () => {
  it('should have an initialState (@@INIT)', () => {
    expect(SelectionsReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })
  const clearState = {
    peername: '',
    name: '',
    isLinked: false,
    published: false,
    activeTab: 'status',
    component: '',
    commit: '',
    commitComponent: ''
  }

  // 
  // DATASET_FAIL
  // SIGNIN_SUCC,
  // SIGNUP_SUCC,
  // SELECTIONS_CLEAR
  // 
  const casesClearSelection = [
    DATASET_FAIL,
    SIGNIN_SUCC,
    SIGNUP_SUCC,
    SELECTIONS_CLEAR
  ]

  casesClearSelection.forEach(action => {
    it (`case ${action}`, () => {
      Reducer(SelectionsReducer).expect({type: action}).toReturnState(clearState)
    })
  })

  // 
  // SELECTIONS_SET_ACTION_TAB
  // 
  it ('SELECTIONS_SET_ACTIVE_TAB', () => {
    const action = {
      type: SELECTIONS_SET_ACTIVE_TAB,
      payload: {
        activeTab: 'history'
      }
    }
    Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({activeTab: 'history'})
  })

  // 
  // SELECTIONS_SET_SELECTED_LISTITEM
  // 
  const casesSelectedListItem = [
    {
      type: 'component',
      selectedListItem: 'meta'
    },
    {
      type: 'commit',
      selectedListItem: 'HASH'
    },
    {
      type: 'commitComponent',
      selectedListItem: 'body'
    }
  ]

  casesSelectedListItem.forEach( c => {
    const action = {
      type: SELECTIONS_SET_SELECTED_LISTITEM,
      payload: c
    }
    it (`case ${c.type} of SELECTIONS_SET_SELECTED_LISTITEM`, () => {
      Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({[c.type]:c.selectedListItem})
    })
  })

  // 
  // SELECTIONS_SET_ACTIVE_TAB
  // 
  it ('SELECTIONS_SET_ACTIVE_TAB', () => {
    const action = {
      type: SELECTIONS_SET_ACTIVE_TAB,
      payload: {
        activeTab: 'history'
      }
    }
    Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({activeTab: 'history'})
  })

  // 
  // SELECTIONS_SET_WORKING_DATASET
  // 
  const casesWorkingDataset = [
    {
      describe: 'set linked dataset as working dataset',
      payload: {
        peername: 'foo',
        name: 'bar',
        isLinked: true,
        published: true
      },
      expected: {
        activeTab: 'status'
      }
    },
    {
      describe: 'set unlinked dataset as working dataset',
      payload: {
        peername: 'foo',
        name: 'bar',
        isLinked: false,
        published: false
      },
      expected: {
        activeTab: 'history'
      }
    },
  ]

  casesWorkingDataset.forEach( ({describe, payload, expected}) => {
    it (`case ${describe} of SELECTIONS_SET_WORKING_DATASET`, () => {
      const action = {
        type: SELECTIONS_SET_WORKING_DATASET,
        payload
      }
      Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({...payload, ...expected})
    })
  })
  
  // 
  // ADD_SUCC
  // 
  it ('ADD_SUCC', () => {
    const expected = {
      peername: 'foo',
      name: 'bar',
      isLinked: true,
      published: false
    }
    const action = {
      type: ADD_SUCC,
      payload: {
        data: expected
      }
    }
    Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({...expected, activeTab: 'history'})
  })

  // 
  // INIT_SUCC
  // 
  it ('INIT_SUCC', () => {
    const expected = {
      peername: 'foo',
      name: 'bar',
      isLinked: true,
      published: false
    }
    const action = {
      type: INIT_SUCC,
      payload: {
        data: expected
      }
    }
    Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({...expected, activeTab: 'status'})
  })

  // 
  // COMMIT_SUCC
  // DATASET_SUCC
  // 
  const datasetCommitCases = [
    {
      type: COMMIT_SUCC,
      describe: 'default commitComponent body',
      payload: {
        data: {
          dataset: {
            bodyPath: 'foo',
            schema: {
              id: 'bar'
            }
          }
        }
      },
      expected: {
        commitComponent: 'body'
      }
    },
    {
      type: COMMIT_SUCC,
      describe: 'default commitComponent body',
      payload: {
        data: {
          dataset: {
            meta: {
              foo: 'bar'
            },
            bodyPath: 'foo'
          }
        }
      },
      expected: {
        commitComponent: 'meta'
      }
    },
    {
      type: COMMIT_SUCC,
      describe: 'default commitComponent body',
      payload: {
        data: {
          dataset: {
            schema: {
              id: 'foo'
            }
          }
        }
      },
      expected: {
        commitComponent: 'schema'
      }
    },
    {
      type: DATASET_SUCC,
      describe: 'default commit body',
      payload: {
        data: {
          dataset: {
            bodyPath: 'foo',
            schema: {
              id: 'bar'
            }
          }
        }
      },
      expected: {
        component: 'body'
      }
    },
    {
      type: DATASET_SUCC,
      describe: 'default component body',
      payload: {
        data: {
          dataset: {
            meta: {
              foo: 'bar'
            },
            bodyPath: 'foo'
          }
        }
      },
      expected: {
        component: 'meta'
      }
    },
    {
      type: DATASET_SUCC,
      describe: 'default component body',
      payload: {
        data: {
          dataset: {
            schema: {
              id: 'foo'
            }
          }
        }
      },
      expected: {
        component: 'schema'
      }
    }
  ]
  datasetCommitCases.forEach(({type, describe, payload, expected}) => {
    const action = {
      type,
      payload
    }
    it (`case ${describe} of ${type}`, () => {
      Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({...expected})
    })
  })

  // PUBLISH_SUCC
  // UNPUBLISH_SUCC
  const pubCases = [
    {
      type: PUBLISH_SUCC,
      expected: {
        published: true
      }
    },
    {
      type: UNPUBLISH_SUCC,
      expected: {
        published: false
      }
    },
  ]
  pubCases.forEach(({type, expected}) => {
    it (type, () => {
      Reducer(SelectionsReducer).withState(initialState).expect({type}).toChangeInState({...expected})
    })
  })
})
