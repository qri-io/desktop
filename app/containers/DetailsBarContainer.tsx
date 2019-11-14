import { connect } from 'react-redux'
import DetailsBar from '../components/DetailsBar'
import { setDetailsBar } from '../actions/ui'

const mapStateToProps = (state: any) => {
  const { ui } = state
  return {
    details: ui.detailsBar
  }
}

const actions = {
  setDetailsBar
}

export default connect(mapStateToProps, actions)(DetailsBar)
