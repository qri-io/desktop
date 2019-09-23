import { apiActionTypes, getActionType, isApiAction } from '../../../app/utils/actionType'

describe('apiActionTypes', () => {
  const cases = [
    {
      description: 'empty string',
      endpoint: '',
      expected: [`API__REQUEST`, `API__SUCCESS`, `API__FAILURE`]
    },
    {
      description: 'lower case string',
      endpoint: 'foo',
      expected: [`API_FOO_REQUEST`, `API_FOO_SUCCESS`, `API_FOO_FAILURE`]
    },    
    {
      description: 'camel case string',
      endpoint: 'FoO',
      expected: [`API_FOO_REQUEST`, `API_FOO_SUCCESS`, `API_FOO_FAILURE`]
    },  
    {
      description: 'upper case string',
      endpoint: 'FOO',
      expected: [`API_FOO_REQUEST`, `API_FOO_SUCCESS`, `API_FOO_FAILURE`]
    },     
  ]
  cases.forEach(({description, endpoint, expected}) => {
    it (`case '${description}'`, () => {
      const got = apiActionTypes(endpoint)
      expect(got).toStrictEqual(expected)
    })
  })
})

describe('getActionType', () => {
  const cases = [
    {
      description: 'empty action type',
      action: undefined,
      expected: ''
    },
    {
      description: 'request action type',
      action: { type: 'FOO_REQUEST'},
      expected: 'request'
    },    
    {
      description: 'success action type',
      action: { type: 'FOO_SUCCESS'},
      expected: 'success'
    },  
    {
      description: 'failure action type',
      action: { type: 'FOO_FAILURE'},
      expected: 'failure'
    },  
    {
      description: 'malformed request action type',
      action: { type: 'REQUEST_FOO'},
      expected: ''
    },
    {
      description: 'malformed success action type',
      action: { type: 'SUCCESS_FOO'},
      expected: ''
    },  
    {
      description: 'malformed failure action type',
      action: { type: 'FAILURE_FOO'},
      expected: ''
    },  
    {
      description: 'lowercase request action type',
      action: { type: 'FOO_request'},
      expected: ''
    },
    {
      description: 'lowercase success action type',
      action: { type: 'FOO_success'},
      expected: ''
    },  
    {
      description: 'lowercase failure action type',
      action: { type: 'FOO_failure'},
      expected: ''
    }    
  ]
  cases.forEach(({description, action, expected}) => {
    it (`case '${description}'`, () => {
      const got = getActionType(action)
      expect(got).toBe(expected)
    })
  })
})

describe('isApiAction', () => {
  const cases = [
    {
      description: 'empty action',
      action: undefined,
      expected: false
    },
    {
      description: 'lowercase api action type',
      action: { type: 'api'},
      expected: false
    },    
    {
      description: 'malformed api action type',
      action: { type: 'FOO_API'},
      expected: false
    },    
    {
      description: 'nonsense action type',
      action: { type: 'jfkdsajljf'},
      expected: false
    },    
    {
      description: 'correct api action type',
      action: { type: 'API'},
      expected: true
    },    
  ]
  cases.forEach(({description, action, expected}) => {
    it (`case '${description}'`, () => {
      const got = isApiAction(action)
      expect(got).toBe(expected)
    })
  })
})