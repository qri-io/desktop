import { connect } from 'react-redux'
import SaveForm from '../components/SaveForm'
import { saveWorkingDataset } from '../actions/api'
import { setSaveValue } from '../actions/mutations'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { save } = state.mutations
  const { isLoading } = save
  const { title, message } = save.value
  return {
    title,
    message,
    isLoading
  }
}

const actions = {
  saveWorkingDataset,
  setSaveValue
}

export default connect(mapStateToProps, actions)(SaveForm)
