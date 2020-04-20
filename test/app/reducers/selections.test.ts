/* global describe, it, expect */
import { Reducer } from 'redux-testkit'
import SelectionsReducer, {
  initialState,
  SELECTIONS_SET_ACTIVE_TAB,
  SELECTIONS_SET_SELECTED_LISTITEM,
  SELECTIONS_SET_WORKING_DATASET,
  SELECTIONS_CLEAR,
  DATASET_SUCC,
  DATASET_FAIL,
  COMMIT_SUCC,
  SIGNIN_SUCC,
  SIGNUP_SUCC,
  REMOVE_SUCC
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
    activeTab: 'status',
    component: '',
    commit: '',
    commitComponent: ''
  }

  // DATASET_FAIL
  it(`DATASET_FAIL with 422 error`, () => {
    const state = {
      peername: 'foo',
      name: 'bar'
    }
    const action = {
      type: DATASET_FAIL,
      payload: {
        err: {
          code: 422
        }
      }
    }
    Reducer(SelectionsReducer).withState(state).expect(action).toReturnState(state)
  })
  it(`DATASET_FAIL with any other error`, () => {
    const state = {
      peername: 'foo',
      name: 'bar'
    }
    const action = {
      type: DATASET_FAIL,
      payload: {
        err: {
          code: 500
        }
      }
    }
    Reducer(SelectionsReducer).withState(state).expect(action).toReturnState(clearState)
  })

  // REMOVE_SUCC
  it(`REMOVE_SUCC where removed dataset isn't the selected dataset`, () => {
    const state = {
      peername: 'foo',
      name: 'bar'
    }
    const action = {
      type: REMOVE_SUCC,
      payload: {
        request: {
          segments: {
            peername: 'baz',
            name: 'qux'
          }
        }
      }
    }
    Reducer(SelectionsReducer).withState(state).expect(action).toReturnState(state)
  })
  it(`REMOVE_SUCC where dataset is the currently selected dataset`, () => {
    const state = {
      peername: 'foo',
      name: 'bar'
    }
    const action = {
      type: REMOVE_SUCC,
      payload: {
        request: {
          segments: {
            peername: 'foo',
            name: 'bar'
          }
        }
      }
    }
    Reducer(SelectionsReducer).withState(state).expect(action).toReturnState(clearState)
  })

  //
  // SIGNIN_SUCC,
  // SIGNUP_SUCC,
  // SELECTIONS_CLEAR
  //
  const casesClearSelection = [
    SIGNIN_SUCC,
    SIGNUP_SUCC,
    SELECTIONS_CLEAR
  ]

  casesClearSelection.forEach(action => {
    it(`case ${action}`, () => {
      Reducer(SelectionsReducer).expect({ type: action }).toReturnState(clearState)
    })
  })

  //
  // SELECTIONS_SET_ACTION_TAB
  //
  it('SELECTIONS_SET_ACTIVE_TAB', () => {
    const action = {
      type: SELECTIONS_SET_ACTIVE_TAB,
      payload: {
        activeTab: 'history'
      }
    }
    Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({ activeTab: 'history' })
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

  casesSelectedListItem.forEach(c => {
    const action = {
      type: SELECTIONS_SET_SELECTED_LISTITEM,
      payload: c
    }
    it(`case ${c.type} of SELECTIONS_SET_SELECTED_LISTITEM`, () => {
      Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({ [c.type]: c.selectedListItem })
    })
  })

  //
  // SELECTIONS_SET_ACTIVE_TAB
  //
  it('SELECTIONS_SET_ACTIVE_TAB', () => {
    const action = {
      type: SELECTIONS_SET_ACTIVE_TAB,
      payload: {
        activeTab: 'history'
      }
    }
    Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({ activeTab: 'history' })
  })

  //
  // SELECTIONS_SET_WORKING_DATASET
  //
  const casesWorkingDataset = [
    {
      describe: 'set peername and name',
      payload: {
        peername: 'foo',
        name: 'bar'
      },
      expected: {
        peername: 'foo',
        name: 'bar'
      }
    }
  ]

  casesWorkingDataset.forEach(({ describe, payload, expected }) => {
    it(`case ${describe} of SELECTIONS_SET_WORKING_DATASET`, () => {
      const action = {
        type: SELECTIONS_SET_WORKING_DATASET,
        payload
      }
      Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({ ...payload, ...expected })
    })
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
            structure: {
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
            structure: {
              id: 'foo'
            }
          }
        }
      },
      expected: {
        commitComponent: 'structure'
      }
    },
    {
      type: DATASET_SUCC,
      describe: 'default commit body',
      payload: {
        data: {
          dataset: {
            bodyPath: 'foo',
            structure: {
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
            structure: {
              id: 'foo'
            }
          }
        }
      },
      expected: {
        component: 'structure'
      }
    }
  ]
  datasetCommitCases.forEach(({ type, describe, payload, expected }) => {
    const action = {
      type,
      payload
    }
    it(`case ${describe} of ${type}`, () => {
      Reducer(SelectionsReducer).withState(initialState).expect(action).toChangeInState({ ...expected })
    })
  })
})
