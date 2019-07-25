import {
  Middleware,
  Dispatch,
  AnyAction
} from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import Store from '../models/store'

// CALL_API is a global, unique constant for passing actions to API middleware
export const CALL_API = Symbol('CALL_API')

// ApiAction is an action that api middleware will operate on. ApiAction
// intentionally does _not_ extend Action. when api middleware encounters an
// ApiAction, it will immideately fire a API_[endpoint]_REQUEST action and
// either API_[ENDPOINT]_SUCCESS or API_[ENDPOINT]_FAILURE on request completion
export interface ApiAction extends AnyAction {
  // All ApiAction details are specified under the CALL_API symbol key
  [CALL_API]: {
    // endpoint is the api endpoint to call
    endpoint: string
    // method is the HTTP method used
    method: 'GET' | 'PUT' | 'POST' | 'DELETE'
    // params is a list of parameters used to construct the API request
    segments?: ApiSegments
    // query is an object of query parameters to be appended to the API call URL
    query?: object
    // body is the body for POST requests
    body?: object|[]
    // map is a function
    // map defaults to the identity function
    map?: (data: object|[]) => any
  }
}

// identityFunc is a function that returns the argument it's passed
const identityFunc = <T>(a: T): T => a

// ApiQueryParams is an interface for all possible query parameters passed to
// the API
export interface ApiSegments {
  peername?: string
  name?: string
  peerID?: string
  path?: string
  page?: number
  pageSize?: number
  fsi?: boolean
}

interface ApiParams {
  [key: string]: string
}

// ApiActionThunk is the return value of an Api action.
// All api actions must return a promise that will be called with their result:
// either a SUCCESS or FAILURE action. This allows callers to chain
// .then(action) to perform additional work after an API call has completed
export type ApiActionThunk = (
  dispatch: ThunkDispatch<any, any, any>,
  getState: () => Store
) => Promise<AnyAction>

// chainSuccess wires together successive ApiActions in a ThunkAction.
// call it with dispatch & getState to get a function that accepts actions,
// and chain it a .then() call off another api response
export function chainSuccess (
  dispatch: ThunkDispatch<any, any, any>,
  getState: () => Store) {
  return (thunk: ApiActionThunk) => {
    return async (action: AnyAction) => {
      if (action.type.indexOf(`_SUCCESS`) > 0) {
        return thunk(dispatch, getState)
      }
      throw action
    }
  }
}

// APIResponseEnvelope is interface all API responses conform to
interface APIResponseEnvelope {
  meta: object
  data: object|any[]
  pagination?: object
}

export function apiActionTypes (endpoint: string): [string, string, string] {
  const name = endpoint.toUpperCase()
  return [`API_${name}_REQUEST`, `API_${name}_SUCCESS`, `API_${name}_FAILURE`]
}

// getJSON fetches json data from a url
async function getJSON<T> (url: string, options: FetchOptions): Promise<T> {
  const res = await fetch(url, options)
  if (res.status !== 200) {
    throw new Error(`Received non-200 status code: ${res.status}`)
  }

  const json = await res.json()
  return json as T
}

// endpointMap is an object that maps frontend endpoint names to their
// corresponding API url path
const endpointMap: Record<string, string> = {
  'list': 'list',
  'dataset': '', // dataset endpoints are constructured through query param values
  'body': 'body', // dataset endpoints are constructured through query param values
  'history': 'history',
  'status': 'dsstatus',
  'save': 'fsi/save',
  'fsilinks': 'fsilinks',
  'add': 'add',
  'init': 'fsi/init'
}

function apiUrl (endpoint: string, segments?: ApiSegments, params?: ApiParams): [string, string] {
  const path = endpointMap[endpoint]
  if (path === undefined) {
    return ['', `${endpoint} is not a valid api endpoint`]
  }

  let url = `http://localhost:2503/${path}`
  if (!segments) {
    return [url, '']
  }

  if (segments.peername) {
    url += `/${segments.peername}`
  }
  if (segments.name) {
    url += `/${segments.name}`
  }
  if (segments.peerID || segments.path) {
    url += '/at'
  }
  if (segments.peerID) {
    url += `/${segments.peerID}`
  }
  if (segments.path) {
    url += segments.path
  }

  if (params) {
    url += '?'
    Object.keys(params).forEach((key) => {
      url += `${key}=${params[key]}`
    })
  }
  return [url, '']
}

interface FetchOptions {
  method: string
  body?: string
}

// getAPIJSON constructs an API url & fetches a JSON response
async function getAPIJSON<T> (
  endpoint: string,
  method: string,
  segments?: ApiSegments,
  params?: ApiParams,
  body?: object|[]
): Promise<T> {
  const [url, err] = apiUrl(endpoint, segments, params)
  if (err) {
    throw err
  }
  const options: FetchOptions = { method }
  if (body) options.body = JSON.stringify(body)
  return getJSON(url, options)
}

// apiMiddleware manages requests to the qri JSON API
export const apiMiddleware: Middleware = () => (next: Dispatch<AnyAction>) => async (action: any): Promise<any> => {
  if (action[CALL_API]) {
    let data: APIResponseEnvelope
    let { endpoint = '', method, map = identityFunc, segments, params, body } = action[CALL_API]
    const [REQ_TYPE, SUCC_TYPE, FAIL_TYPE] = apiActionTypes(action.type)

    next({ type: REQ_TYPE })

    try {
      data = await getAPIJSON(endpoint, method, segments, params, body)
    } catch (err) {
      return next({
        type: FAIL_TYPE,
        payload: { err }
      })
    }

    return next({
      type: SUCC_TYPE,
      payload: {
        data: map(data.data)
        // TODO (b5) - we should be able to handle pagination response
        // state here
        // pagination:
      }
    })
  }

  return next(action)
}
