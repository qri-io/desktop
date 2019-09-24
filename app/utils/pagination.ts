import { AnyAction } from 'redux'
import { PageInfo } from '../models/store'
import { getActionType } from '../utils/actionType'

export const initialPageInfo: PageInfo = {
  isFetching: true,
  page: 0,
  fetchedAll: false,
  error: '',
  pageSize: 0
}

export function fetchedAll (data: Object | any[] | undefined, pageSize: number): boolean {
  if (!data || typeof data !== 'object') return false
  return Object.keys(data).length < pageSize
}

export function reducerWithPagination (action: AnyAction, pageInfo: PageInfo = initialPageInfo): PageInfo {
  switch (getActionType(action)) {
    case 'request':
      return {
        fetchedAll: false,
        isFetching: true,
        page: action.pageInfo.page,
        pageSize: action.pageInfo.pageSize,
        error: ''
      }
    case 'success':
      return {
        page: action.payload.request.pageInfo.page,
        pageSize: action.payload.request.pageInfo.pageSize,
        error: '',
        isFetching: false,
        fetchedAll: fetchedAll(action.payload.data, action.payload.request.pageInfo.pageSize)
      }
    case 'failure':
      return {
        page: action.payload.request.pageInfo.page,
        pageSize: action.payload.request.pageInfo.pageSize,
        isFetching: false,
        error: action.payload.err.message,
        fetchedAll: false
      }
    default:
      return pageInfo
  }
}

interface ActionWithPaginationRes {
  page: number
  doNotFetch: boolean
}

export function actionWithPagination (page: number, prevPageInfo: PageInfo): ActionWithPaginationRes {
  // if page === -1
  // then we are invalidating the pagination
  if (page === -1) return { page: 1, doNotFetch: false }
  //
  // and we have already fetched this page,
  // or we've already fetched all the entries
  // bail early!
  if (page <= prevPageInfo.page || prevPageInfo.fetchedAll) {
    return { page, doNotFetch: true }
  }
  return { page, doNotFetch: false }
}
