import {
  Middleware,
  Dispatch,
  AnyAction
} from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import Store from '../models/store'
import mapError from './mapError'

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
    method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS'
    // params is a list of parameters used to construct the API request
    segments?: ApiSegments
    // query is an object of query parameters to be appended to the API call URL
    query?: ApiQuery
    // body is the body for POST requests
    body?: object|[]
    // pageInfo is the pagination information
    pageInfo?: ApiPagination
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
  fsi?: boolean
}

interface ApiPagination {
  page: number
  pageSize: number
}
interface ApiQuery {
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
  const r = await fetch(url, options)
  const res = await r.json()
  if (res.meta.code !== 200) {
    throw new Error(mapError(res.meta.error))
  }
  return res as T
}

function apiUrl (endpoint: string, segments?: ApiSegments, query?: ApiQuery, pageInfo?: ApiPagination): [string, string] {
  const addToUrl = (url: string, seg: string): string => {
    if (!(url[url.length - 1] === '/' || seg[0] === '/')) url += '/'
    return url + seg
  }
  let url = `http://localhost:2503/${endpoint}`
  if (segments) {
    if (segments.peername) {
      url = addToUrl(url, segments.peername)
    }
    if (segments.name) {
      url = addToUrl(url, segments.name)
    }
    if (segments.peerID || segments.path) {
      url = addToUrl(url, 'at')
    }
    if (segments.peerID) {
      url = addToUrl(url, segments.peerID)
    }
    if (segments.path) {
      url = addToUrl(url, segments.path)
    }
  }

  if (query) {
    Object.keys(query).forEach((key, index) => {
      url += index === 0 ? '?' : '&'
      url += `${key}=${query[key]}`
    })
  }

  if (pageInfo) {
    url += query ? '&' : '?'
    url += `page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
  }
  return [url, '']
}

interface FetchOptions {
  method: string
  headers: Record<string, string>
  body?: string
}

// getAPIJSON constructs an API url & fetches a JSON response
async function getAPIJSON<T> (
  endpoint: string,
  method: string,
  segments?: ApiSegments,
  query?: ApiQuery,
  pageInfo?: ApiPagination,
  body?: object|[]
): Promise<T> {
  const [url, err] = apiUrl(endpoint, segments, query, pageInfo)
  if (err) {
    throw err
  }
  const options: FetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  if (body) options.body = JSON.stringify(body)
  return getJSON(url, options)
}

// apiMiddleware manages requests to the qri JSON API
export const apiMiddleware: Middleware = () => (next: Dispatch<AnyAction>) => async (action: any): Promise<any> => {
  if (action[CALL_API]) {
    let data: APIResponseEnvelope
    let { endpoint = '', method, map = identityFunc, segments, params, body, pageInfo } = action[CALL_API]
    const [REQ_TYPE, SUCC_TYPE, FAIL_TYPE] = apiActionTypes(action.type)

    next({ type: REQ_TYPE, pageInfo })

    // TODO (chriswhong): Turn this into dev middleware
    // // to simulate an API failure response in development, add dummySuccess to the action object
    // if (action.dummyFailure) {
    //   return next({
    //     type: FAIL_TYPE,
    //     payload: {
    //       data: action.dummyFailure
    //     }
    //   })
    // }
    //
    // // to simulate an API success response in development, add dummySuccess to the action object
    // if (action.dummySuccess) {
    //   return next({
    //     type: SUCC_TYPE,
    //     payload: {
    //       data: action.dummySuccess
    //     }
    //   })
    // }

    try {
      data = await getAPIJSON(endpoint, method, segments, params, pageInfo, body)
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
      }
    })
  }

  return next(action)
}
