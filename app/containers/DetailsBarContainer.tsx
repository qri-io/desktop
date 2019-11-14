import { connect } from 'react-redux'
import DetailsBar from '../components/DetailsBar'

const mapStateToProps = (state: any) => {
  const { ui } = state
  return {
    details: ui.detailsBar
  }
}

const actions = {
}

export default connect(mapStateToProps, actions)(DetailsBar)
