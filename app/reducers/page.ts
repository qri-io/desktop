import { AnyAction } from 'redux'
import { PageInfo } from '../models/store'
import { getActionType } from '../utils/actionType'

const initialPageInfo = {
  isFetching: true,
  page: 0,
  fetchedAll: false,
  error: '',
  pageSize: 0
}

export function withPagination (action: AnyAction, pageInfo: PageInfo = initialPageInfo): PageInfo {
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
