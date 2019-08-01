import * as React from 'react'
import { HotTable } from '@handsontable/react'

interface HandsonTableProps {
  headers?: any[]
  body: any[]
}

export default class HandsonTable extends React.Component<HandsonTableProps> {
  private hotRef: React.RefObject<HotTable>;
  constructor (props: HandsonTableProps) {
    super(props)
    this.hotRef = React.createRef()
  }

  handleVerticalScroll () {
    if (this.hotRef.current) {
      const { hotInstance } = this.hotRef.current
      const autoRowSize = hotInstance.getPlugin('autoRowSize')

      const totalRows = hotInstance.countRows()
      const lastVisibleRow = autoRowSize.getLastVisibleRow() + 1 // add 1 because it's zero indexed

      if (lastVisibleRow === totalRows) console.log('YOU ARE AT THE BOTTOM OF THE LIST, GET DATA NOW!!!!!')
    }
  }

  componentDidMount () {

  }

  render () {
    const { body } = this.props
    const headers = this.props.headers ? this.props.headers : true

    return (
      <div>
        <HotTable
          ref={this.hotRef}
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
          autoRowSize
          afterScrollVertically={() => { this.handleVerticalScroll() }}
        />
      </div>
    )
  }
}
