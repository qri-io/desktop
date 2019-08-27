import { connect } from 'react-redux'
import App, { AppProps } from '../components/App'
import Store from '../models/store'

import {
  fetchMyDatasets,
  addDatasetAndFetch,
  initDatasetAndFetch,
  pingApi
} from '../actions/api'

import {
  acceptTOS,
  setQriCloudAuthenticated,
  closeToast,
  setApiConnection,
  setModal
} from '../actions/ui'

import {
  fetchSession,
  signup
} from '../actions/session'

import {
  setWorkingDataset
} from '../actions/selections'

const mergeProps = (props: any, actions: any): AppProps => {
  return { ...props, ...actions }
}

const AppContainer = connect(
  (state: Store) => {
    const { ui, myDatasets, session } = state
    const loading = ui.apiConnection === 0
    const hasDatasets = myDatasets.value.length !== 0
    const { id: sessionID, peername } = session
    const { apiConnection, toast, modal } = ui
    return {
      hasDatasets,
      loading,
      sessionID,
      peername,
      toast,
      modal,
      apiConnection
    }
  },
  {
    fetchSession,
    fetchMyDatasets,
    acceptTOS,
    signup,
    setQriCloudAuthenticated,
    addDataset: addDatasetAndFetch,
    initDataset: initDatasetAndFetch,
    closeToast,
    pingApi,
    setApiConnection,
    setWorkingDataset,
    setModal
  },
  mergeProps
)(App)

export default AppContainer
