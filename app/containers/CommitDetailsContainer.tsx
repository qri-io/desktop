import { connect } from 'react-redux'
import CommitDetails, { CommitDetailsProps } from '../components/CommitDetails'
import Store from '../models/store'
import { setSidebarWidth } from '../actions/ui'
import { setSelectedListItem } from '../actions/selections'
import { fetchCommitDetail } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { workingDataset, selections, ui, commitDetails } = state

  const {
    peername,
    name,
    commit: selectedCommitPath,
    commitComponent: selectedComponent
  } = selections

  // find the currently selected commit
  const selectedCommit = workingDataset.history.value
    .find(d => d.path === selectedCommitPath)

  return {
    peername,
    name,
    selectedCommitPath: selectedCommitPath,
    commit: selectedCommit,
    selectedComponent,
    sidebarWidth: ui.commitSidebarWidth,
    commitDetails,
    structure: commitDetails.components.structure.value
  }
}

const actions = {
  setSelectedListItem,
  setSidebarWidth,
  fetchCommitDetail
}

const mergeProps = (props: any, actions: any): CommitDetailsProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, actions, mergeProps)(CommitDetails)
