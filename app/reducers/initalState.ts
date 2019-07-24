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
  value: [
    {
      title: 'World Bank Population',
      peername: 'b5',
      name: 'world_bank_population',
      hash: 'QmNj8pkhhKB3sEGMHkEhtEEAXmrnGDbMQpYH5KJ8rjGYHK',
      path: '',
      isLinked: true,
      changed: false
    },
    {
      title: 'USGS Earthquakes',
      peername: 'chriswhong',
      name: 'usgs_earthquakes',
      hash: 'QmUcrSm1RcCLANVLGWoVWCZsG1Y9bhL9Ha2vFEd5MvNV4p',
      path: '',
      isLinked: true,
      changed: false
    },
    {
      title: 'Baltimore Bus Timeliness (June 2019)',
      peername: 'chriswhong',
      name: 'baltimore_bus_timeliness',
      hash: 'QmUcrSm1RcCLANVLGWoVWCZsG1Y9bhL9Ha2vFEd4HvNV4p',
      path: '',
      isLinked: true,
      changed: false
    },
    {
      title: 'PLUTO Modified Parcels',
      peername: 'chriswhong',
      name: 'pluto_modified_parcels',
      hash: 'QmUcrSm1RcCLANVLGWoVWCZsG1Y9bhL9HaQnFEd5MvNV4p',
      path: '',
      isLinked: true,
      changed: false
    }
  ],
  filter: ''
}
