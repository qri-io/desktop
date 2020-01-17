import { connect } from 'react-redux'
import CommitDetails, { CommitDetailsProps } from '../components/CommitDetails'
import Store from '../models/store'
import { setSidebarWidth } from '../actions/ui'
import { setSelectedListItem } from '../actions/selections'
import { fetchCommitDetail } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { selections, commitDetails } = state

  const {
    peername,
    name,
    commit: selectedCommitPath,
    commitComponent: selectedComponent
  } = selections

  return {
    peername,
    name,
    selectedCommitPath: selectedCommitPath,
    commit: commitDetails.components.commit.value,
    selectedComponent,
    commitDetails,
    structure: commitDetails.components.structure.value,
    isLoading: commitDetails.isLoading
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
