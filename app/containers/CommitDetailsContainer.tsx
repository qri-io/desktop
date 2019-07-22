import { connect } from 'react-redux'
import CommitDetails from '../components/CommitDetails'
import Store from '../models/store'
import { setSidebarWidth } from '../actions/ui'
import { setSelectedListItem } from '../actions/selections'
import { fetchCommitDetail } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { workingDataset, selections, ui } = state

  const {
    commit: selectedCommitPath,
    commitComponent: selectedComponent
  } = selections

  // find the currently selected commit
  const selectedCommit = workingDataset.history.value
    .find(d => d.path === selectedCommitPath)

  return {
    commit: selectedCommit,
    selectedComponent,
    sidebarWidth: ui.commitSidebarWidth
  }
}

const actions = {
  setSidebarWidth,
  setSelectedListItem,
  fetchCommitDetail
}

export default connect(mapStateToProps, actions)(CommitDetails)
