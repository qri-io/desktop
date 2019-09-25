import { connect } from 'react-redux'
import MetadataEditor from '../components/MetadataEditor'
import Store from '../models/store'

import { fsiWriteAndFetch } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { workingDataset } = state

  // get data for the currently selected component

  return { workingDataset }
}

const actions = {
  fsiWrite: fsiWriteAndFetch
}

export default connect(mapStateToProps, actions)(MetadataEditor)
