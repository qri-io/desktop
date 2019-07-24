// import top-level state interfaces
import {
  MyDatasets
} from '../models/store'

export let myDatasets: MyDatasets = {
  pageInfo: {
    isFetching: false,
    pageCount: 1,
    fetchedAll: true
  },
  value: [],
  filter: ''
}
