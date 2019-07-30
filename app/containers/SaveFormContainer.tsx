import { connect } from 'react-redux'
import SaveForm from '../components/SaveForm'
import { saveWorkingDataset } from '../actions/api'
import { setSaveValue } from '../actions/mutations'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { title, message } = state.mutations.save.value
  return {
    title,
    message
  }
}

const actions = {
  saveWorkingDataset,
  setSaveValue
}

export default connect(mapStateToProps, actions)(SaveForm)
