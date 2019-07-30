import { connect } from 'react-redux'
import App from '../components/App'
import Store from '../models/store'

import { fetchSession, fetchMyDatasetsAndLinks, addDatasetAndFetch, initDatasetAndFetch } from '../actions/api'
import { acceptTOS, setPeername, closeToast } from '../actions/ui'

const AppContainer = connect(
  (state: Store) => {
    const { ui, myDatasets, session } = state
    const loading = myDatasets.pageInfo.isFetching || session.id === ''
    const hasDatasets = myDatasets.value.length !== 0
    const { id: sessionID, peername } = session
    const { hasAcceptedTOS, hasSetPeername, toast } = ui
    return {
      hasAcceptedTOS,
      hasSetPeername,
      hasDatasets,
      loading,
      sessionID,
      peername,
      toast
    }
  },
  {
    fetchSession,
    fetchMyDatasetsAndLinks,
    acceptTOS,
    setPeername,
    addDataset: addDatasetAndFetch,
    initDataset: initDatasetAndFetch,
    closeToast
  }
)(App)

export default AppContainer
