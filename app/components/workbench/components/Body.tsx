import * as React from 'react'
import { Action, Dispatch, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ApiActionThunk } from '../../../store/api'
import { DetailsType, StatsDetails, Details } from '../../../models/details'
import Dataset, { Structure } from '../../../models/dataset'
import Store, { PageInfo, StatusInfo, RouteProps } from '../../../models/store'
import { fetchBody, fetchCommitBody } from '../../../actions/api'
import { setDetailsBar } from '../../../actions/ui'
import { selectHistoryDataset, selectWorkingDataset, selectHistoryStats, selectWorkingStats, selectDetails, selectHistoryDatasetBodyPageInfo, selectWorkingDatasetBodyPageInfo, selectWorkingStatusInfo } from '../../../selections'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import BodyTable from '../../BodyTable'
import BodyJson from '../../BodyJson'
import ParseError from '../ParseError'
import hasParseError from '../../../utils/hasParseError'

export interface BodyProps extends RouteProps {
  qriRef: QriRef
  data: Dataset
  stats: Array<Record<string, any>>
  details: Details
  pageInfo: PageInfo
  statusInfo: StatusInfo
  fetchBody: (username: string, name: string, page?: number, pageSize?: number) => ApiActionThunk
  fetchCommitBody: (username: string, name: string, path: string, page?: number, pageSize?: number) => ApiActionThunk
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

  const handleFetch = (page?: number, pageSize?: number) => {
    const { username, name, path = '' } = qriRef
    if (showHistory) {
      return fetchCommitBody(username, name, path, page, pageSize)
    }
    return fetchBody(username, name, page, pageSize)
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
          highlighedColumnIndex={details.type !== DetailsType.NoDetails ? details.index : undefined}
          onFetch={handleFetch}
          setDetailsBar={handleToggleDetailsBar}
        />
      }
    </div>
  )
}

const mapStateToProps = (state: Store, ownProps: BodyProps) => {
  // TODO(ramfox): when we get a BodyEditor component, pull out all references
  // to showHistory
  const qriRef = qriRefFromRoute(ownProps)
  const showHistory = !!qriRef.path
  return {
    data: showHistory ? selectHistoryDataset(state) : selectWorkingDataset(state),
    stats: showHistory ? selectHistoryStats(state) : selectWorkingStats(state),
    details: selectDetails(state),
    pageInfo: showHistory ? selectHistoryDatasetBodyPageInfo(state) : selectWorkingDatasetBodyPageInfo(state),
    statusInfo: selectWorkingStatusInfo(state, 'body'),
    qriRef
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    fetchBody,
    fetchCommitBody,
    setDetailsBar
  }, dispatch)
}

const mergeProps = (props: any, actions: any): BodyProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BodyComponent)
