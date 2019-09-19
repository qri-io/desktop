import { connect } from 'react-redux'
import Metadata from '../components/Metadata'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { commitDetails } = state

  // get data for the currently selected component
  const meta = commitDetails.components.meta.value
  return { meta }
}

const actions = {}

export default connect(mapStateToProps, actions)(Metadata)
