import { connect } from 'react-redux'
import Routes from '../routes'
import Store from '../models/store'

import {
  acceptTOS,
  setQriCloudAuthenticated,
  setModal
} from '../actions/ui'

import { signup, signin } from '../actions/session'

const mapStateToProps = (state: Store) => {
  const { ui, myDatasets } = state
  const hasDatasets = myDatasets.value.length !== 0
  // if we clear the selection, we still need a default dataset to display.
  // let's always use the first dataset in the list, for now
  const { qriCloudAuthenticated, hasAcceptedTOS } = ui
  return {
    qriCloudAuthenticated,
    hasAcceptedTOS,
    hasDatasets
  }
}

export default connect(mapStateToProps, {
  signup,
  signin,
  acceptTOS,
  setQriCloudAuthenticated,
  setModal
})(Routes)
