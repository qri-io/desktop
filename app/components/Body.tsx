import * as React from 'react'

import BodyTable from './BodyTable'
import BodyJson from './BodyJson'
import { ApiActionThunk } from '../store/api'

import { Action } from 'redux'
import { DetailsType, StatsDetails, Details } from '../models/details'
import Dataset, { Structure } from '../models/dataset'
import { PageInfo } from '../models/store'

export interface BodyProps {
  data: Dataset
  stats: Array<Record<string, any>>
  details: Details
  pageInfo: PageInfo
  fetchBody: (page?: number, pageSize?: number) => ApiActionThunk
  setDetailsBar: (details: Record<string, any>) => Action
}

function shouldDisplayJsonViewer (format: string) {
  return (format !== undefined && format !== 'csv' && format !== 'xlsx')
}

export interface Header {
  title: string
  type: string
}

const extractColumnHeaders = (structure: Structure, value: any[]): undefined | any[] => {
  if (!structure || !value) {
    return undefined
  }
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
    schema.items.items.map((d: { title: string }): Record<string, any> => d)
}

const Body: React.FunctionComponent<BodyProps> = (props) => {
  const {
    data,
    pageInfo,
    stats,
    details,
    setDetailsBar,
    fetchBody
  } = props

  const { body, structure } = data
  const headers = extractColumnHeaders(structure, body)

  const makeStatsDetails = (stats: Record<string, any>, title: string, index: number): StatsDetails => {
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
      {shouldDisplayJsonViewer(structure.format)
        ? <BodyJson
          body={body}
          pageInfo={pageInfo}
        />
        : <BodyTable
          headers={headers}
          body={body}
          pageInfo={pageInfo}
          highlighedColumnIndex={details.type !== DetailsType.NoDetails ? details.index : undefined}
          onFetch={fetchBody}
          setDetailsBar={handleToggleDetailsBar}
        />
      }
    </div>
  )
}

export default Body
