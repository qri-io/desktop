import { connect } from 'react-redux'
import SaveForm from '../components/SaveForm'
import { saveWorkingDataset } from '../actions/api'

const mapStateToProps = () => ({})

const actions = { saveWorkingDataset }

export default connect(mapStateToProps, actions)(SaveForm)
