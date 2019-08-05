// import top-level state interfaces
import {
  MyDatasets
} from '../models/store'

export let myDatasets: MyDatasets = {
  pageInfo: {
    isFetching: false,
    page: 1,
    pageSize: 50,
    fetchedAll: true
  },
  value: [],
  filter: ''
}
