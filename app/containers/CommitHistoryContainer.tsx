import { connect } from 'react-redux'
import HistoryCommit from '../components/HistoryCommit'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { commitDetails } = state
  return {
    commit: commitDetails.components.commit.value
  }
}

export default connect(mapStateToProps)(HistoryCommit)
