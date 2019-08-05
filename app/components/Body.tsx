import * as React from 'react'
import { ApiAction } from '../store/api'
import Toast, { ToastTypes } from './chrome/Toast'
import HandsonTable from './HandsonTable'

import { PageInfo } from '../models/store'

export interface BodyProps {
  value: any[]
  pageInfo: PageInfo
  headers: any[]
  onFetch: (page: number, pageSize: number) => Promise<ApiAction>
}

export default class Body extends React.Component<BodyProps> {
  constructor (props: BodyProps) {
    super(props)

    this.state = {}
    this.handleScrollToBottom.bind(this)
  }

  static getDerivedStateFromProps (nextProps: BodyProps) {
    const { value, pageInfo, onFetch } = nextProps
    const { isFetching, fetchedAll } = pageInfo
    if (
      value.length === 0 &&
      isFetching === false &&
      fetchedAll === false
    ) {
      onFetch(pageInfo.page + 1, pageInfo.pageSize)

      return null
    }

    return null
  }

  handleScrollToBottom () {
    const { pageInfo, onFetch } = this.props
    onFetch(pageInfo.page + 1, pageInfo.pageSize)
  }

  render () {
    return (
      <div className='body-container'>
        {
          this.props.value && (
            <HandsonTable
              headers={this.props.headers}
              body={this.props.value}
              onScrollToBottom={() => { this.handleScrollToBottom() }}
            />
          )
        }
        <Toast
          show={this.props.pageInfo.isFetching && this.props.pageInfo.page > 0}
          type={ToastTypes.message}
          text='Loading more rows...'
        />
      </div>
    )
  }
}
