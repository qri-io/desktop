import * as React from 'react'
import { HotTable } from '@handsontable/react'

interface HandsonTableProps {
  body: any[]
}

export default class HandsonTable extends React.Component<HandsonTableProps> {
  render () {
    const { body } = this.props

    return (
      <div>
        <HotTable data={body} colHeaders={true} rowHeaders={true} />
      </div>
    )
  }
}
