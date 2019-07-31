import { connect } from 'react-redux'
import Body from '../components/Body'
import Store, { WorkingDataset } from '../models/store'
import { fetchBody } from '../actions/api'

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

const mapStateToProps = (state: Store, ownProps: {
  history?: boolean
}) => {
  const { history } = ownProps
  const { workingDataset, commitDetails } = state
  const dataset = history ? commitDetails : workingDataset
  const { isLoading, value } = dataset.components.body

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
