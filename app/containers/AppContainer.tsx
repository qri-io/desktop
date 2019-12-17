import { connect } from 'react-redux'
import App, { AppProps } from '../components/App'
import Store from '../models/store'

import {
  fetchMyDatasets,
  addDatasetAndFetch,
  linkDatasetAndFetch,
  pingApi,
  publishDataset,
  unpublishDataset,
  removeDatasetAndFetch,
  importFile,
  fetchWorkingDatasetDetails
} from '../actions/api'

import {
  acceptTOS,
  setQriCloudAuthenticated,
  openToast,
  closeToast,
  setModal,
  setDatasetDirPath,
  setExportPath,
  signout
} from '../actions/ui'

import {
  bootstrap,
  signup
} from '../actions/session'

import {
  setWorkingDataset,
  setRoute
} from '../actions/selections'

const mergeProps = (props: any, actions: any): AppProps => {
  return { ...props, ...actions }
}

const AppContainer = connect(
  (state: Store) => {
    const { ui, myDatasets, session, workingDataset, connection, selections } = state
    const { apiConnection } = connection
    const loading = connection.apiConnection === 0 || session.isLoading
    const hasDatasets = myDatasets.value.length !== 0
    const { toast, modal, datasetDirPath, exportPath } = ui

    return {
      hasDatasets,
      loading,
      session,
      selections,
      toast,
      modal,
      workingDataset,
      apiConnection,
      datasetDirPath,
      exportPath
    }
  },
  {
    bootstrap,
    fetchMyDatasets,
    acceptTOS,
    signup,
    setQriCloudAuthenticated,
    addDataset: addDatasetAndFetch,
    linkDataset: linkDatasetAndFetch,
    openToast,
    closeToast,
    pingApi,
    setWorkingDataset,
    setExportPath,
    setModal,
    publishDataset,
    unpublishDataset,
    removeDatasetAndFetch,
    setDatasetDirPath,
    signout,
    setRoute,
    importFile,
    fetchWorkingDatasetDetails
  },
  mergeProps
)(App)

export default AppContainer
