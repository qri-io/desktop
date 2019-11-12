import { connect } from 'react-redux'
import ReadmeHistory from '../components/ReadmeHistory'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { selections } = state

  const { peername, name, commit } = selections

  // get data for the currently selected component
  return {
    peername,
    path: commit,
    name
  }
}

export default connect(mapStateToProps)(ReadmeHistory)
