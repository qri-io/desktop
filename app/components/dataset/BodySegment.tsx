import React from 'react'
import numeral from 'numeral'

import Dataset from '../../models/dataset'
import Segment from '../chrome/Segment'

interface BodyPreviewProps {
  data: Dataset
}

const BodyPreviewTable: React.FunctionComponent<BodyPreviewProps> = ({ data }) => {
  const { body, structure } = data

  const bdy = addRowNumbers(body)
  console.log(bdy)

  const tableRows = bdy.map((row, i) => {
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

  return (
    <table style={{ display: 'table' }}>
      <thead>
        <tr>
          <th>
            <div className='cell'>&nbsp;</div>
          </th>
          {/* {headers && headers.map((d: any, j: number) => {
            return (
              <th key={j} className={(j === highlighedColumnIndex) ? 'highlighted' : '' }>
                <div className='cell' onClick={() => setDetailsBar(j)}>
                  <TypeLabel type={d.type} showLabel={false}/>&nbsp;{d.title}
                </div>
              </th>
            )
          })} */}
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
  </table>)
}

const previewLength = (body: Body) => {
  return Array.isArray(body) ? body.length : Object.keys(body).length
}

// adds row numbers to an array of objects
const addRowNumbers = (body: Body) => {
  // if (Array.isArray(body)) {
  //   return body.map((d: object, i): object => ({
  //     ' ': i + 1,
  //     ...d
  //   }))
  // }

  // return Object.keys(body as Record<any, any>).map((key: string): Record<any, any> => ({
  //   ' ': key,
  //   ...body[key]
  // }))
  return body
}

// // transform csvBody (array of arrays) + csv Schema into an array of objects
// // to feed ts-react-json-table
// // TODO (chriswhong): this assumes depth 2 and a good schema, handle other varieties
// const transformCsvBody = (csvBody: any[], csvSchema: any) => {
//   // make an array of column names
//   const columns: string[] = csvSchema.items.items.map((d: { title: string }): string => d.title)
//   // map each array of csv values into an object
//   return csvBody.map((row) => {
//     const rowObject: {
//       [key: string]: any
//     } = {}

//     // for each column header, set a value on rowObject
//     columns.forEach((column: string, i: number) => {
//       rowObject[column] = row[i]
//     })
//     return rowObject
//   })
// }

interface BodySegmentProps {
  name?: string
  data: Dataset
}

const BodySegment: React.FunctionComponent<BodySegmentProps> = ({ data }) => {
  if (!data.body) {
    return null
  }

  return <Segment
    icon='body'
    name='body'
    subhead='previewing 100 of 2,206 rows'
    content={<BodyPreviewTable data={data} />}
  />
}

export default BodySegment
