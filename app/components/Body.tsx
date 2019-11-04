import * as React from 'react'

import BodyTable from './BodyTable'
import BodyJson from './BodyJson'
import { ApiAction } from '../store/api'

import Spinner from './chrome/Spinner'
import { PageInfo, WorkingDataset } from '../models/store'

export interface BodyProps {
  workingDataset: WorkingDataset
  peername: string
  name: string
  path: string
  value: any[]
  pageInfo: PageInfo
  history: boolean
  format: string
  fetchBody: (page?: number, pageSize?: number) => Promise<ApiAction>
  fetchCommitBody: (page?: number, pageSize?: number) => Promise<ApiAction>
}

function shouldDisplayTable (value: any[] | Object, format: string) {
  return value && (format === 'csv' || format === 'xlsx')
}

const extractColumnHeaders = (workingDataset: WorkingDataset): undefined | object => {
  const structure = workingDataset.components.structure.value
  const schema = structure.schema

  if (!schema) {
    // iterate over first row of body
    const firstRow = workingDataset.components.body.value && workingDataset.components.body.value[0]
    if (!firstRow) return undefined

    // need to take a slice from index 1 because we have mutated the
    // body to have each row[0] be a row number
    // this row number does not get it's own header
    return firstRow.slice(1).map((d: any, i: number) => `field_${i + 1}`)
  }

  if (schema && (!schema.items || (schema.items && !schema.items.items))) {
    return undefined
  }

  return schema && schema.items && schema.items.items.map((d: { title: string }): string => d.title)
}

const Body: React.FunctionComponent<BodyProps> = (props) => {
  const {
    value,
    pageInfo,
    workingDataset,
    history,
    fetchBody,
    format,
    fetchCommitBody
  } = props

  const onFetch = history ? fetchCommitBody : fetchBody

  const headers = extractColumnHeaders(workingDataset)

  // if there's no value or format, don't show anything yet
  const showSpinner = !(value && format)

  return (
    <div className='transition-group'>
      <>
        { showSpinner &&
          <div className='spinner-container'>
            <Spinner />
          </div>
        }
        { !showSpinner &&
          <>
            {shouldDisplayTable(value, format)
              ? <BodyTable
                headers={headers}
                body={value}
                onFetch={onFetch}
                pageInfo={pageInfo}
              />
              : <BodyJson
                body={value}
                pageInfo={pageInfo}
              />
            }
          </>
        }
      </>
    </div>
  )
}

export default Body
