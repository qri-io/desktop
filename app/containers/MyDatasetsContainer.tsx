import { connect } from 'react-redux'
import { fetchMyDatasets } from '../actions/api'
import { DatasetList } from '../components/DatasetList'

const mapStateToProps = (state: any) => {
  return {
    value: state.myDatasets
  }
}

const actions = {
  fetchMyDatasets
}

export default connect(mapStateToProps, actions)(DatasetList)
