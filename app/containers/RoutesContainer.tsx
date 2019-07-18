import { connect } from 'react-redux'
import Routes from '../routes'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { ui } = state
  return { ui }
}

export default connect(mapStateToProps)(Routes)
