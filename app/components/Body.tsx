import * as React from 'react'
import { ApiAction } from '../store/api'
import Toast, { ToastTypes } from './chrome/Toast'

import { PageInfo } from '../models/store'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
const HandsonTable = React.lazy(() => import('./HandsonTable')) //eslint-disable-line

export interface BodyProps {
  value: any[]
  pageInfo: PageInfo
  headers: any[]
  onFetch: (page?: number, pageSize?: number) => Promise<ApiAction>
}

export default class Body extends React.Component<BodyProps> {
  constructor (props: BodyProps) {
    super(props)

    this.state = {}
    this.handleScrollToBottom.bind(this)
  }

  componentDidMount () {
    if (this.props.value.length === 0) this.props.onFetch()
  }

  handleScrollToBottom () {
    const { pageInfo, onFetch } = this.props
    onFetch(pageInfo.page + 1, pageInfo.pageSize)
  }

  render () {
    return (
      <React.Suspense fallback={<div><SpinnerWithIcon loading={true}/></div>} >
        <HandsonTable
          headers={this.props.headers}
          body={this.props.value}
          onScrollToBottom={() => { this.handleScrollToBottom() }}
        />
        <Toast
          show={this.props.pageInfo.isFetching && this.props.pageInfo.page > 0}
          type={ToastTypes.message}
          text='Loading more rows...'
        />
      </React.Suspense>
    )
  }
}
