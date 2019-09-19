import { connect } from 'react-redux'
import MetadataEditor from '../components/MetadataEditor'
import Store from '../models/store'

import { fsiWrite } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { workingDataset } = state

  // get data for the currently selected component

  return { workingDataset }
}

const actions = {
  fsiWrite
}

export default connect(mapStateToProps, actions)(MetadataEditor)
