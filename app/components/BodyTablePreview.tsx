import React from 'react'

import Dataset, { Body, ColumnProperties } from '../models/dataset'
import { schemaColumns } from '../utils/schemaColumns'
import { TypeLabel } from './TwoDSchemaLayout'

interface BodyPreviewProps {
  data: Dataset
}

// BodyTablePreview is a lightweight version of BodyTable that we're hoping to
// merge into BodyTable in the near future
// TODO (b5) - merge BodyTablePreview functionality into BodyTable
const BodyTablePreview: React.FunctionComponent<BodyPreviewProps> = ({ data }) => {
  const { body, structure } = data

  if (!body) return null

  const bdy = addRowNumbers(body)

  const tableRows = bdy.map((row: any[], i: number) => {
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

  let headers: ColumnProperties[] = []
  if (structure && structure.schema) {
    schemaColumns(structure.schema).forEach((column: ColumnProperties) => {
      headers.push(column)
    })
  }

  return (<div className='table-container'>
    <table style={{ display: 'table' }}>
      <thead>
        <tr>
          <th>
            <div className='cell'>#</div>
          </th>
          {headers.length > 0 && headers.map((d: any, j: number) => {
            return (
              <th key={j} >
                <div className='cell' >
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
    </table>
  </div>)
}

// adds row numbers to an array of arrays or object
const addRowNumbers = (body: Body): any[][] | any[] => {
  if (!body) return body
  if (Array.isArray(body)) {
    return body.map((row: any[], i): any[] => { return [i, ...row] })
  }

  return Object.keys(body).map((key: string): Record<any, any> => ({
    ' ': key,
    ...body[key]
  }))
}

export default BodyTablePreview
