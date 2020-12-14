import React from 'react'
import { Action } from 'redux'

import { ApiActionThunk } from '../../../store/api'
import { DetailsType, StatsDetails, Details } from '../../../models/details'
import Dataset, { IStatTypes, Structure } from '../../../models/dataset'
import Store, { PageInfo, StatusInfo, RouteProps } from '../../../models/store'
import { fetchBody, fetchCommitBody } from '../../../actions/api'
import { setDetailsBar } from '../../../actions/ui'
import { selectDataset, selectWorkingDataset, selectDatasetStats, selectWorkingStats, selectDetails, selectDatasetBodyPageInfo, selectWorkingDatasetBodyPageInfo, selectWorkingStatusInfo } from '../../../selections'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import BodyTable from '../../BodyTable'
import BodyJson from '../../BodyJson'
import ParseError from '../ParseError'
import hasParseError from '../../../utils/hasParseError'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'
import { schemaColumns } from '../../../utils/schemaColumns'

export interface BodyProps extends RouteProps {
  qriRef: QriRef
  data: Dataset
  stats: IStatTypes[]
  details: Details
  pageInfo: PageInfo
  statusInfo: StatusInfo
  fetchBody: (username: string, name: string, page?: number, pageSize?: number) => ApiActionThunk
  fetchCommitBody: (username: string, name: string, path: string, page?: number, pageSize?: number) => ApiActionThunk
  setDetailsBar: (details: Record<string, any>) => Action
}

function shouldDisplayJsonViewer (format: string) {
  return !format || (format !== 'csv' && format !== 'xlsx')
}

export interface Header {
  title: string
  type: string
}

const extractColumnHeaders = (structure: Structure, value: any[]): undefined | Header[] => {
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

  return schemaColumns(schema).map((d: { title: string, type: string}): Header => d)
}

export const BodyComponent: React.FunctionComponent<BodyProps> = (props) => {
  const {
    data,
    pageInfo,
    stats,
    details,
    setDetailsBar,
    fetchBody,
    fetchCommitBody,
    statusInfo,
    qriRef
  } = props

  if (hasParseError(statusInfo)) {
    return <ParseError component='body' />
  }

  const showHistory = !!qriRef.path

  const { body, structure } = data

  const headers = extractColumnHeaders(structure, body)

  const makeStatsDetails = (stats: IStatTypes, title: string, index: number): StatsDetails => {
    return {
      type: DetailsType.StatsDetails,
      title: title,
      index: index,
      stats: stats
    }
  }

  const handleToggleDetailsBar = (index: number) => {
    if (!stats || stats.length === 0 || !headers) return
    if (details.type === DetailsType.NoDetails) {
      setDetailsBar(makeStatsDetails(stats[index], headers[index].title, index))
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
      setDetailsBar(makeStatsDetails(stats[index], headers[index].title, index))
    }
  }

  const handleFetch = (page?: number, pageSize?: number) => {
    const { username, name, path = '' } = qriRef
    if (showHistory) {
      return fetchCommitBody(username, name, path, page, pageSize)
    }
    return fetchBody(username, name, page, pageSize)
  }

  let highlightedColumnIndex
  if (details.type !== DetailsType.NoDetails) {
    highlightedColumnIndex = details.index
  }

  return (
    <div className='transition-group'>
      {shouldDisplayJsonViewer(structure.format)
        ? <BodyJson
          data={body}
          pageInfo={pageInfo}
          previewWarning={false}
        />
        : <BodyTable
          headers={headers}
          body={body}
          pageInfo={pageInfo}
          highlighedColumnIndex={highlightedColumnIndex}
          onFetch={handleFetch}
          setDetailsBar={stats && handleToggleDetailsBar}
        />
      }
    </div>
  )
}

export default connectComponentToProps(
  BodyComponent,
  (state: Store, ownProps: BodyProps) => {
    // TODO(ramfox): when we get a BodyEditor component, pull out all references
    // to showHistory
    const qriRef = qriRefFromRoute(ownProps)
    const showHistory = !!qriRef.path
    return {
      data: showHistory ? selectDataset(state) : selectWorkingDataset(state),
      stats: showHistory ? selectDatasetStats(state) : selectWorkingStats(state),
      details: selectDetails(state),
      pageInfo: showHistory ? selectDatasetBodyPageInfo(state) : selectWorkingDatasetBodyPageInfo(state),
      statusInfo: selectWorkingStatusInfo(state, 'body'),
      qriRef
    }
  },
  {
    fetchBody,
    fetchCommitBody,
    setDetailsBar
  }
)
