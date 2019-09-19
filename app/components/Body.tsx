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

function shouldDisplayTable (value: any[], structure: Structure) {
  // if it's a CSV, or if JSON with depth of 2, render a table
  return value && structure && structure.depth === 2
}

const Body: React.FunctionComponent<BodyProps> = ({ value, pageInfo, headers, structure, onFetch }) => {
  const isLoadingFirstPage = (pageInfo.page === 1 && pageInfo.isFetching)

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
          {shouldDisplayTable(value, structure)
            ? <HandsonTable
              headers={headers}
              body={value}
              onScrollToBottom={handleScrollToBottom}
            />
            : <ReactJson
              name={null}
              src={value}
              displayDataTypes={false}
            />
          }
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
