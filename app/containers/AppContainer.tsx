import { connect } from 'react-redux'
import App from '../components/App'
import Store from '../models/store'

import {
  fetchMyDatasetsAndLinks,
  addDatasetAndFetch,
  initDatasetAndFetch,
  pingApi
} from '../actions/api'
import {
  acceptTOS,
  setHasSetPeername,
  setApiConnection
} from '../actions/ui'

import { fetchSession, setPeername } from '../actions/session'

const AppContainer = connect(
  (state: Store) => {
    const { ui, myDatasets, session } = state
    const loading = ui.apiConnection === 0
    const hasDatasets = myDatasets.value.length !== 0
    const { id: sessionID, peername } = session
    const { hasAcceptedTOS, hasSetPeername, apiConnection } = ui
    return {
      hasAcceptedTOS,
      hasSetPeername,
      hasDatasets,
      loading,
      sessionID,
      peername,
      apiConnection
    }
  },
  {
    fetchSession,
    fetchMyDatasetsAndLinks,
    acceptTOS,
    setPeername,
    setHasSetPeername,
    addDataset: addDatasetAndFetch,
    initDataset: initDatasetAndFetch,
    pingApi,
    setApiConnection
  }
)(App)

export default AppContainer
