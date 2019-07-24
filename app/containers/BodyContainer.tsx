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

const mapStateToProps = (state: Store) => {
  const { workingDataset } = state

  const headers = extractColumnHeaders(workingDataset)

  // get data for the currently selected component
  return {
    workingDataset,
    headers
  }
}

const actions = {
  fetchBody
}

export default connect(mapStateToProps, actions)(Body)
