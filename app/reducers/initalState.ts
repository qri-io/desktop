// import top-level state interfaces
import {
  UI,
  Selections,
  MyDatasets,
  WorkingDataset
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

export let selections: Selections = {
  peername: 'chriswhong',
  name: 'usgs_earthquakes',
  activeTab: 'status',
  component: 'meta',
  commit: '',
  commitComponent: ''
}

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

export let workingDataset: WorkingDataset = {
  path: '/ipfs/QmNj8pkhhKB3sEGMHkEhtEEAXmrnGDbMQpYH5KJ8rjGYHK',
  prevPath: '',
  peername: 'b5',
  name: 'world_bank_population',
  pages: {},
  diff: {},
  value: {
    meta: {
      description: '( 1 ) United Nations Population Division. World Population Prospects: 2017 Revision. ( 2 ) Census reports and other statistical publications from national\nstatistical offices, ( 3 ) Eurostat: Demographic Statistics, ( 4 ) United Nations Statistical Division. Population and Vital Statistics Reprot ( various years ),\n( 5 ) U.S. Census Bureau: International Database, and ( 6 ) Secretariat of the Pacific Community: Statistics and Demography Programme.\n',
      downloadURL: 'http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv',
      homeURL: 'https://data.worldbank.org/indicator/sp.pop.totl',
      keywords: [
        'united nations',
        'population',
        'world bank',
        'census'
      ],
      license: {
        type: 'CC-BY-4.0',
        url: 'https://creativecommons.org/licenses/by/4.0/'
      },
      qri: 'md:0',
      theme: [
        'population'
      ],
      title: 'World Bank Population'
    },
    schema: {
      items: {
        items: [
          {
            title: 'field_1',
            type: 'string'
          },
          {
            title: 'field_2',
            type: 'string'
          },
          {
            title: 'field_3',
            type: 'string'
          }
        ],
        type: 'array'
      },
      type: 'array'
    },
    body: [
      ['a', 'b', 'c'],
      ['1', '2', '3']
    ],
    commit: {
      author: 'QmSyDX5LYTiwQi861F5NAwdHrrnd1iRGsoEvCyzQMUyZ4W',
      message: '\t- modified scriptPath\n',
      path: '/ipfs/QmQNadUztHx5HmWM5mrhmngdfwqLEw1fyvENw7haoTBCEr',
      timestamp: new Date('2019-03-20T20:02:24.689938Z'),
      title: 'Transform: 1 change'
    }
  },
  status: {
    meta: {
      filepath: 'meta.json',
      status: 'unmodified',
      errors: [],
      warnings: []
    },
    schema: {
      filepath: 'schema.json',
      status: 'unmodified',
      errors: [],
      warnings: []
    },
    body: {
      filepath: 'body.csv',
      status: 'unmodified',
      errors: [],
      warnings: []
    }
  },
  history: {
    pageInfo: {
      isFetching: false,
      pageCount: 1,
      fetchedAll: true
    },
    value: [
      {
        author: 'QmSyDX5LYTiwQi861F5NAwdHrrnd1iRGsoEvCyzQMUyZ4W',
        message: ' - modified checksum - modified entries - ... ...modified length',
        path: '/ipfs/QmcoAc6NvivopgMoLUtTEVjLytuxwi99Dn5qe6mWvtij8q',
        timestamp: new Date('2019-03-20T19:40:45.088207Z'),
        title: 'Structure: 3 changes'
      }, {
        author: 'QmSyDX5LYTiwQi861F5NAwdHrrnd1iRGsoEvCyzQMUyZ4W',
        message: '\t- modified scriptPath\n',
        path: '/ipfs/QmXrNxhrrtR9EB55Nb93szgNhrJ4Z3HApeTTnHa84sQ5Hz',
        timestamp: new Date('2019-03-20T19:39:42.211127Z'),
        title: 'created dataset'
      }
    ]
  }
}
