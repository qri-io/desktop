import { connect } from 'react-redux'
import App from '../components/App'
import Store from '../models/store'

import { fetchSession, fetchMyDatasetsAndLinks, addDatasetAndFetch } from '../actions/api'
import { acceptTOS, setPeername } from '../actions/ui'

const AppContainer = connect(
  (state: Store) => {
    const { ui, myDatasets, session } = state
    const loading = myDatasets.pageInfo.isFetching || session.id === ''
    const hasDatasets = myDatasets.value.length !== 0
    const { id: sessionID, peername } = session
    const { hasAcceptedTOS, hasSetPeername } = ui
    return {
      hasAcceptedTOS,
      hasSetPeername,
      hasDatasets,
      loading,
      sessionID,
      peername
    }
  },
  {
    fetchSession,
    fetchMyDatasetsAndLinks,
    acceptTOS,
    setPeername,
    addDataset: addDatasetAndFetch
  }
)(App)

export default AppContainer
