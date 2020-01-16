import * as React from 'react'

import BodyTable from './BodyTable'
import BodyJson from './BodyJson'
import { ApiAction } from '../store/api'
import { Structure } from '../models/dataset'

import { PageInfo, WorkingDataset } from '../models/store'
import { Action } from 'redux'
import { DetailsType, Details, StatsDetails } from '../models/details'

export interface BodyProps {
  workingDataset: WorkingDataset
  peername: string
  name: string
  path: string
  value: any[]
  structure: Structure
  pageInfo: PageInfo
  history: boolean
  format: string
  details: Details
  stats: Array<{[key: string]: any}>

  fetchBody: (page?: number, pageSize?: number) => Promise<ApiAction>
  fetchCommitBody: (page?: number, pageSize?: number) => Promise<ApiAction>
  setDetailsBar: (details: {[key: string]: any}) => Action
}

function shouldDisplayTable (value: any[] | Object, format: string) {
  return value && (format === 'csv' || format === 'xlsx')
}

export interface Header {
  title: string
  type: string
}

const extractColumnHeaders = (structure: any, value: any): undefined | object => {
  const schema = structure.schema

  if (!schema) {
    // iterate over first row of body
    const firstRow = value && value[0]
    if (!firstRow) return undefined

    // need to take a slice from index 1 because we have mutated the
    // body to have each row[0] be a row number
    // this row number does not get it's own header
    return firstRow.slice(1).map((d: any, i: number) => `field_${i + 1}`)
  }

  if (schema && (!schema.items || (schema.items && !schema.items.items))) {
    return undefined
  }

  return schema &&
    schema.items &&
    schema.items.items.map((d: { title: string }): string => d)
}

const Body: React.FunctionComponent<BodyProps> = (props) => {
  const {
    value,
    pageInfo,
    history,
    fetchBody,
    format,
    fetchCommitBody,
    details,
    setDetailsBar,
    stats,
    structure
  } = props

  const onFetch = history ? fetchCommitBody : fetchBody

  const headers = extractColumnHeaders(structure, value)

  const makeStatsDetails = (stats: {[key: string]: any}, title: string, index: number): StatsDetails => {
    return {
      type: DetailsType.StatsDetails,
      title: title,
      index: index,
      stats: stats
    }
  }

  const handleToggleDetailsBar = (index: number) => {
    if (!stats || stats.length === 0) return
    const statsHeaders = headers as string[]
    if (details.type === DetailsType.NoDetails) {
      setDetailsBar(makeStatsDetails(stats[index], statsHeaders[index], index))
      return
    }
    if (details.type === DetailsType.StatsDetails) {
      // if the index is the same, then the user has clicked
      // on the header twice. The second time, we should
      // remove the detailsbar
      if (details.index === index) {
        setDetailsBar({ type: DetailsType.NoDetails })
        return
      }
      setDetailsBar(makeStatsDetails(stats[index], statsHeaders[index], index))
    }
  }

  return (
    <div className='transition-group'>
      {shouldDisplayTable(value, format)
        ? <BodyTable
          headers={headers}
          body={value}
          pageInfo={pageInfo}
          highlighedColumnIndex={details.type !== DetailsType.NoDetails ? details.index : undefined}
          onFetch={onFetch}
          setDetailsBar={handleToggleDetailsBar}
        />
        : <BodyJson
          body={value}
          pageInfo={pageInfo}
        />
      }
    </div>
  )
}

export default Body
