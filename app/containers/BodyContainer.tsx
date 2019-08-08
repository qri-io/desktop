import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import Body, { BodyProps } from '../components/Body'
import Store, { WorkingDataset } from '../models/store'
import { fetchBody, fetchCommitBody } from '../actions/api'

const extractColumnHeaders = (workingDataset: WorkingDataset): undefined | object => {
  const schema = workingDataset.components.schema.value

  if (!schema) {
    return undefined
  }

  if (schema && (!schema.items || (schema.items && !schema.items.items))) {
    return undefined
  }

  return schema && schema.items && schema.items.items.map((d: { title: string }): string => d.title)
}

interface BodyContainerProps {
  history?: boolean
}

const mapStateToProps = (state: Store, ownProps: BodyContainerProps) => {
  const { history } = ownProps
  const { workingDataset, commitDetails, selections } = state
  const dataset = history ? commitDetails : workingDataset
  const { pageInfo, value } = dataset.components.body
  const { peername, name, commit: path } = selections

  const headers = extractColumnHeaders(workingDataset)

  // get data for the currently selected component
  return {
    peername,
    path,
    name,
    pageInfo,
    headers,
    value,
    datasetLoading: workingDataset.isLoading
  }
}

const mergeProps = (props: any, actions: any): BodyProps => {
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: BodyContainerProps) => {
  const onFetch = ownProps.history ? fetchCommitBody : fetchBody
  return bindActionCreators({ onFetch }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Body)
