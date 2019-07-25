import { connect } from 'react-redux'
import App from '../components/App'
import Store from '../models/store'

import { fetchSession, fetchMyDatasets } from '../actions/api'

const AppContainer = connect(
  (state: Store) => {
    const { ui, myDatasets, session } = state
    const loading = myDatasets.pageInfo.isFetching
    const hasDatasets = myDatasets.value.length === 0 && myDatasets.pageInfo.fetchedAll
    const sessionID = session.id
    const { hasAcceptedTOS, hasSetPeername } = ui
    return { hasAcceptedTOS, hasSetPeername, hasDatasets, loading, sessionID }
  },
  { fetchSession, fetchMyDatasets }
)(App)

export default AppContainer
