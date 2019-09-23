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

export function reducerWithPagination (action: AnyAction, pageInfo: PageInfo = initialPageInfo): PageInfo {
  switch (getActionType(action)) {
    case 'request':
      return Object.assign({},
        pageInfo,
        {
          isFetching: true,
          page: action.pageInfo.page,
          pageSize: action.pageInfo.pageSize,
          error: ''
        })
    case 'success':
      return Object.assign({},
        pageInfo,
        {
          isFetching: false,
          fetchedAll: action.payload.data.length < pageInfo.pageSize
        })
    case 'failure':
      return Object.assign({},
        pageInfo,
        {
          isFetching: false,
          error: action.payload.err.message
        })
    default:
      return pageInfo
  }
}

interface ActionWithPaginationRes {
  page: number
  bailEarly: boolean
}

export function actionWithPagination (invalidatePagination: boolean, page: number, prevPageInfo: PageInfo): ActionWithPaginationRes {
  // if we aren't invalidating the pagination,
  // and we have already fetched this page,
  // or we've already fetched all the entries
  // bail early!
  if (
    !invalidatePagination && (
      page <= prevPageInfo.page ||
    prevPageInfo.fetchedAll)
  ) {
    return { page: 0, bailEarly: true }
  }
  // if we are invalidating the pagination, start the pagination at 1!
  if (invalidatePagination) return { page: 1, bailEarly: false }
  return { page, bailEarly: false }
}
