import * as React from 'react'
import * as _ from 'underscore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

import { TypeLabel } from './TwoDSchemaLayout'
import { bodyPageSizeDefault } from '../actions/api'
import { PageInfo } from '../models/store'
import { ApiActionThunk } from '../store/api'

interface BodyTableProps {
  headers?: any[]
  body: any[]
  highlighedColumnIndex: number | undefined
  onFetch: (page?: number, pageSize?: number) => ApiActionThunk
  setDetailsBar: (index: number) => void
  pageInfo: PageInfo
}

const BODY_ROW_HEIGHT = 31

// given the scroll direction, current rows, and pageSize, determine the next page
const getNextPageNumber = (direction: 'up' | 'down', value: any[], pageSize: number) => {
  if (direction === 'down') {
    const lastIndex = parseInt(value[value.length - 1][0]) + 1
    const lastPage = Math.ceil(lastIndex / pageSize)
    return lastPage + 1
  }

  const firstIndex = parseInt(value[0][0])
  const firstPage = Math.floor((firstIndex + pageSize) / pageSize)
  return firstPage - 1
}

export default class BodyTable extends React.Component<BodyTableProps> {
  constructor (props: BodyTableProps) {
    super(props)
    this.state = {
      bodyLength: 0
    }

    // use underscore to debounce the onScroll event
    this.handleVerticalScrollThrottled = _.debounce(this.handleVerticalScroll, 250)
  }

  handleVerticalScroll () {
    // onScroll is firing on the containing div so there is no 'e'
    // grab the scrollable container from the BodyTable layout
    const scroller: any = document.getElementById('body-table-container')
    const { scrollHeight, scrollTop, offsetHeight } = scroller
    if (scrollHeight === parseInt(scrollTop) + parseInt(offsetHeight)) {
      this.fetchNextPage('down')
    }

    if (scrollTop === 0) {
      this.fetchNextPage('up')
    }
  }

  handleVerticalScrollThrottled () {}

  componentDidUpdate (prevProps: BodyTableProps) {
    // on update, compare the indices of the body rows to determine if a new
    // page was added above or below.  set scrollTop to the correct amount to
    // maintain the user's view
    const { body: prevBody } = prevProps
    const { body } = this.props
    if (prevBody.length && body.length) {
      // get the first and last row indices for the current and previous bodies
      const prevFirstIndex = prevBody[0][0]
      const prevLastIndex = prevBody[prevBody.length - 1][0]
      const firstIndex = body[0][0]
      const lastIndex = body[body.length - 1][0]

      const scroller: any = document.getElementById('body-table-container')

      // scroll down
      // set scrollTop if not first page and last row is different from previous
      if ((prevLastIndex > bodyPageSizeDefault) && (lastIndex !== prevLastIndex)) {
        const rowOffset = lastIndex - prevLastIndex
        scroller.scrollTop = scroller.scrollTop - (BODY_ROW_HEIGHT * rowOffset)
      }

      // scroll up
      if (firstIndex !== prevFirstIndex) {
        scroller.scrollTop = BODY_ROW_HEIGHT * bodyPageSizeDefault
      }
    }
  }

  fetchNextPage (direction: 'up' | 'down') {
    const { body, pageInfo, onFetch } = this.props
    if (direction === 'down' && pageInfo.fetchedAll === true) { return }
    const page = getNextPageNumber(direction, body, pageInfo.pageSize)

    onFetch(page, pageInfo.pageSize)
  }

  render () {
    const { body, headers, pageInfo, highlighedColumnIndex, setDetailsBar } = this.props
    const { isFetching, fetchedAll } = pageInfo

    if (isFetching) return null

    const tableRows = body.map((row, i) => {
      return (
        <tr key={i}>
          {row.map((d: any, j: number) => {
            const isFirstColumn = j === 0
            if (isFirstColumn) d = parseInt(d) + 1
            return (
              <td key={j} className={isFirstColumn ? 'first-column' : ''}>
                <div className='cell'>{typeof d === 'boolean' ? JSON.stringify(d) : d}</div>
              </td>
            )
          })}
        </tr>
      )
    })
    if (!body.length) return null
    return (
      <div
        id='body-table-container'
        onScroll={() => { this.handleVerticalScrollThrottled() } }
      >
        <table style={{ display: 'table' }}>
          <thead>
            <tr>
              <th>
                <div className='cell'>&nbsp;</div>
              </th>
              {headers && headers.map((d: any, j: number) => {
                return (
                  <th key={j} className={(j === highlighedColumnIndex) ? 'highlighted' : '' }>
                    <div className='cell' onClick={() => setDetailsBar(j)}>
                      <TypeLabel type={d.type} showLabel={false}/>&nbsp;{d.title}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
          {!fetchedAll && (
            <tfoot>
              <tr>
                <th>
                  <div className='bottom-filler'>&nbsp;</div>
                </th>
              </tr>
            </tfoot>
          )}
        </table>
        {!fetchedAll && (
          <div className='sync-spinner bottom-loading-spinner'><FontAwesomeIcon icon={faSync} /> Loading...</div>
        )}
      </div>
    )
  }
}
