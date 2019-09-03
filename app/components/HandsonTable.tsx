import * as React from 'react'
import { HotTable } from '@handsontable/react'
import * as _ from 'underscore'

interface HandsonTableProps {
  headers?: any[]
  body: any[]
  onScrollToBottom: () => void
}

export default class HandsonTable extends React.Component<HandsonTableProps> {
  constructor (props: HandsonTableProps) {
    super(props)

    // use underscore to debounce the onScroll event
    this.handleVerticalScrollThrottled = _.debounce(this.handleVerticalScroll, 100)
  }

  handleVerticalScroll () {
    // onScroll is firing on the containing div so there is no 'e'
    // grab the scrollable container from the HandsonTable layout
    const scroller: any = document.getElementsByClassName('wtHolder')[0]
    const { scrollHeight, scrollTop, offsetHeight } = scroller

    if (scrollHeight === parseInt(scrollTop) + parseInt(offsetHeight)) {
      this.props.onScrollToBottom()
    }
  }

  handleVerticalScrollThrottled () {}

  render () {
    const { body } = this.props
    const headers = this.props.headers ? this.props.headers : true

    return (
      <div onScroll={() => this.handleVerticalScrollThrottled() }>
        <HotTable
          data={body}
          colHeaders={headers}
          rowHeaders
          manualColumnResize
          manualRowResize
          stretchH='all'
          autoWrapRow
          viewportColumnRenderingOffset={100}
          viewportRowRenderingOffset={100}
          columnSorting
          readOnly
        />
      </div>
    )
  }
}
