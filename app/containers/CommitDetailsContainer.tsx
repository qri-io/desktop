import { connect } from 'react-redux'
import CommitDetails from '../components/CommitDetails'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { workingDataset, selections } = state

  const { commit: selectedCommitPath } = selections

  // find the currently selected commit
  const selectedCommit = workingDataset.history.value
    .find(d => d.path === selectedCommitPath)

  return { commit: selectedCommit }
}

const actions = {}

export default connect(mapStateToProps, actions)(CommitDetails)
