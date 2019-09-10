import { connect } from 'react-redux'
import SaveForm from '../components/SaveForm'
import { saveWorkingDataset } from '../actions/api'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { isLoading } = state.mutations.save
  const { status } = state.workingDataset
  return {
    isLoading,
    status
  }
}

const actions = {
  saveWorkingDataset
}

export default connect(mapStateToProps, actions)(SaveForm)
