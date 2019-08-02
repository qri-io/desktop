import { connect } from 'react-redux'
import App from '../components/App'
import Store from '../models/store'

import {
  fetchMyDatasets,
  addDatasetAndFetch,
  initDatasetAndFetch,
  pingApi
} from '../actions/api'

import {
  acceptTOS,
  setHasSetPeername,
  closeToast,
  setApiConnection
} from '../actions/ui'

import {
  fetchSession,
  setPeername
} from '../actions/session'

const AppContainer = connect(
  (state: Store) => {
    const { ui, myDatasets, session } = state
    const loading = ui.apiConnection === 0
    const hasDatasets = myDatasets.value.length !== 0
    const { id: sessionID, peername } = session
    const { hasAcceptedTOS, hasSetPeername, apiConnection, toast } = ui
    return {
      hasAcceptedTOS,
      hasSetPeername,
      hasDatasets,
      loading,
      sessionID,
      peername,
      toast,
      apiConnection
    }
  },
  {
    fetchSession,
    fetchMyDatasets,
    acceptTOS,
    setPeername,
    setHasSetPeername,
    addDataset: addDatasetAndFetch,
    initDataset: initDatasetAndFetch,
    closeToast,
    pingApi,
    setApiConnection
  }
)(App)

export default AppContainer
