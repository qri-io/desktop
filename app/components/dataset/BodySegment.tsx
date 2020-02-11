import React from 'react'
// import numeral from 'numeral'

import Dataset, { Body } from '../../models/dataset'
import Segment from '../chrome/Segment'
import { TypeLabel } from '../TwoDSchemaLayout'
import BodyJson from '../BodyJson'

interface BodyPreviewProps {
  data: Dataset
}

const BodyPreviewTable: React.FunctionComponent<BodyPreviewProps> = ({ data }) => {
  const { body, structure } = data

  if (!body) return null

  const bdy = addRowNumbers(body)

  let bodyPreview

  if (!structure || (structure && structure.format !== 'csv')) {
    bodyPreview =
    <div id='json-preview-container'>
      <BodyJson data={bdy} previewWarning={false}/>
    </div>
  } else {
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
    let headers: Array<{ type: string, title: string}> = []
    if (structure && structure.schema) {
      structure.schema.items.items.forEach((column: { type: string, title: string}) => {
        headers.push(column)
      })
    }

    bodyPreview =
    <div className='table-container'>
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
    </div>
  }

  return bodyPreview
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

interface BodySegmentProps {
  name?: string
  data: Dataset
  collapsable?: boolean
}

const BodySegment: React.FunctionComponent<BodySegmentProps> = ({ data, collapsable }) => {
  if (!data.body) {
    return null
  }

  let subhead = ''

  if (data.structure) {
    subhead = `previewing ${data.body.length} of ${data.structure.entries} rows`
  }

  return <Segment
    icon='body'
    name='body'
    subhead={subhead}
    collapsable={collapsable}
    content={<BodyPreviewTable data={data} />}
  />
}

export default BodySegment
