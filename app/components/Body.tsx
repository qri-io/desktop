import * as React from 'react'
import { ApiAction } from '../store/api'
import Toast, { ToastTypes } from './chrome/Toast'

import { PageInfo } from '../models/store'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import HandsonTable from './HandsonTable'
import { CSSTransition } from 'react-transition-group'

export interface BodyProps {
  peername: string
  name: string
  path: string
  value: any[]
  pageInfo: PageInfo
  headers: any[]
  onFetch: (page?: number, pageSize?: number) => Promise<ApiAction>
}

const Body: React.FunctionComponent<BodyProps> = ({ value, pageInfo, headers, onFetch }) => {
  if (!value || value.length === 0) {
    return <SpinnerWithIcon loading={true} />
  }

  const [isLoadingFirstPage, setIsLoadingFirstPage] = React.useState(false)
  const isLoadingFirstPageRef = React.useRef(pageInfo.page === 1 && pageInfo.isFetching)

  const loadingTimeout = setTimeout(() => {
    if (isLoadingFirstPageRef.current) {
      setIsLoadingFirstPage(true)
    }
    clearTimeout(loadingTimeout)
  }, 250)

  React.useEffect(() => {
    if (pageInfo.page === 1 && pageInfo.isFetching) {
      isLoadingFirstPageRef.current = true
    }
  }, [pageInfo.page, pageInfo.isFetching])

  const handleScrollToBottom = () => {
    onFetch(pageInfo.page + 1, pageInfo.pageSize)
  }
  return (
    <div className='transition-group'>
      <CSSTransition
        in={!isLoadingFirstPage}
        timeout={300}
        classNames='fade'
      >
        <div id='transition-wrap'>
          <HandsonTable
            headers={headers}
            body={value}
            onScrollToBottom={() => { handleScrollToBottom() }}
          />
          <Toast
            show={pageInfo.isFetching && pageInfo.page > 0}
            type={ToastTypes.message}
            text='Loading more rows...'
          />
        </div>
      </CSSTransition>
      <SpinnerWithIcon loading={isLoadingFirstPage}/>
    </div>
  )
}

export default Body
