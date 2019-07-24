import * as React from 'react'
import { HotTable } from '@handsontable/react'

interface HandsonTableProps {
  headers?: any[]
  body: any[]
}

export default class HandsonTable extends React.Component<HandsonTableProps> {
  render () {
    const { body } = this.props
    const headers = this.props.headers ? this.props.headers : true

    return (
      <div>
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
        />
      </div>
    )
  }
}
