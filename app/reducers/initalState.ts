// import top-level state interfaces
import {
  UI,
  MyDatasets
} from '../models/store'

export let ui: UI = {
  apiConnection: 1,
  showDatasetList: false,
  errorMessage: null,
  message: null,
  hasAcceptedTOS: true,
  hasSetPeername: true,
  showDiff: false,
  datasetSidebarWidth: 250,
  commitSidebarWidth: 250
}

export let myDatasets: MyDatasets = {
  pageInfo: {
    isFetching: false,
    pageCount: 1,
    fetchedAll: true
  },
  value: [],
  filter: ''
}
