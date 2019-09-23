import { connect } from 'react-redux'
import App, { AppProps } from '../components/App'
import Store from '../models/store'

import {
  fetchMyDatasets,
  addDatasetAndFetch,
  initDatasetAndFetch,
  linkDataset,
  pingApi,
  publishDataset,
  unpublishDataset,
  removeDatasetAndFetch
} from '../actions/api'

import {
  acceptTOS,
  setQriCloudAuthenticated,
  closeToast,
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
    const { ui, myDatasets, session, workingDataset, connection, selections } = state
    const { apiConnection } = connection
    const loading = connection.apiConnection === 0
    const hasDatasets = myDatasets.value.length !== 0
    const { id: sessionID, peername } = session
    const { toast, modal } = ui
    return {
      hasDatasets,
      loading,
      sessionID,
      selections,
      peername,
      toast,
      modal,
      workingDataset,
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
    linkDataset,
    closeToast,
    pingApi,
    setWorkingDataset,
    setModal,
    publishDataset,
    unpublishDataset,
    removeDatasetAndFetch
  },
  mergeProps
)(App)

export default AppContainer
