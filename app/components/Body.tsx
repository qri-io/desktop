import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import ReactJson from 'react-json-view'

import Toast, { ToastTypes } from './chrome/Toast'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import HandsonTable from './HandsonTable'
import { ApiAction } from '../store/api'

import { Structure } from '../models/dataset'
import { PageInfo } from '../models/store'

export interface BodyProps {
  peername: string
  name: string
  path: string
  value: any[]
  pageInfo: PageInfo
  headers: any[]
  onFetch: (page?: number, pageSize?: number) => Promise<ApiAction>
  structure: Structure
}

const Body: React.FunctionComponent<BodyProps> = ({ value, pageInfo, headers, structure, onFetch }) => {
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
    if (isLoadingFirstPage && isLoadingFirstPageRef.current === false) {
      setIsLoadingFirstPage(false)
    }
  }, [pageInfo.page, pageInfo.isFetching])

  const handleScrollToBottom = () => {
    onFetch(pageInfo.page + 1, pageInfo.pageSize)
  }

  let bodyContent
  // if it's a CSV, or if JSON with depth of 2, render a table
  if (value && structure && (structure.format === 'csv' || structure.depth === 2)) {
    bodyContent = (
      <HandsonTable
        headers={headers}
        body={value}
        onScrollToBottom={() => { handleScrollToBottom() }}
      />
    )
  } else { // otherwise use our nifty JSON renderer
    bodyContent = <ReactJson
      name={null}
      src={value}
      displayDataTypes={false}
    />
  }

  return (
    <div className='transition-group'>
      <CSSTransition
        in={!isLoadingFirstPage}
        timeout={300}
        classNames='fade'
      >
        <div id='transition-wrap'>
          {bodyContent}
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
