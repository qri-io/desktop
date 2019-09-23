import { connect } from 'react-redux'
import SaveForm, { SaveFormProps } from '../components/SaveForm'
import { saveWorkingDataset } from '../actions/api'
import Store from '../models/store'
import { setCommitTitle, setCommitMessage } from '../actions/mutations'

const mapStateToProps = (state: Store) => {
  const { isLoading, value } = state.mutations.save
  const { title, message } = value
  const { status } = state.workingDataset
  return {
    isLoading,
    title,
    message,
    status
  }
}

const actions = {
  saveWorkingDataset,
  setCommitTitle,
  setCommitMessage
}

const mergeProps = (props: any, actions: any): SaveFormProps => { //eslint-disable-line
  return { ...props, ...actions }
}

export default connect(mapStateToProps, actions, mergeProps)(SaveForm)
