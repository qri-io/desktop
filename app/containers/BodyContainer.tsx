import { connect } from 'react-redux'
import Body from '../components/Body'
import Store, { WorkingDataset } from '../models/store'
import { fetchBody } from '../actions/api'

const extractColumnHeaders = (workingDataset: WorkingDataset): undefined | object => {
  const { structure } = workingDataset.value
  if (!structure) {
    return undefined
  }

  const { schema } = structure

  if (schema && (!schema.items || (schema.items && !schema.items.items))) {
    return undefined
  }

  return schema && schema.items && schema.items.items.map((d: { title: string }): string => d.title)
}

const mapStateToProps = (state: Store, ownProps: {
  history?: boolean
}) => {
  const { workingDataset } = state
  const { isLoading, value } = state.components.body
  const { history } = ownProps

  const headers = extractColumnHeaders(workingDataset)

  // get data for the currently selected component
  return {
    isLoading,
    headers,
    value,
    history
  }
}

const actions = {
  fetchBody
}

export default connect(mapStateToProps, actions)(Body)
