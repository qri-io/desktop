import * as React from 'react'

const datasets = [
  {
    id: 1,
    title: 'USGS Earthquakes',
    name: 'chriswhong/usgs_earthquakes'
  },
  {
    id: 2,
    title: 'World Bank Population',
    name: 'b5/world_bank_population'
  },
  {
    id: 3,
    title: 'Baltimore Bus Timeliness (June 2019)',
    name: 'chriswhong/baltimore_bus_timeliness'
  },
  {
    id: 4,
    title: 'PLUTO Modified Parcels',
    name: 'chriswhong/nyc_pluto_modified_parcels'
  }
]

export default class DatasetList extends React.Component<{}, { activeTab: string, filterString: string }> {
  constructor (p: {}) {
    super(p)
    this.state = {
      activeTab: 'history',
      filterString: ''
    }
  }

  handleTabClick (activeTab: string) {
    this.setState({ activeTab })
  }

  handleFilterKeyUp (e: any) {
    this.setState({ filterString: e.target.value })
  }

  render () {
    let filteredDatasets = datasets
    const { filterString } = this.state

    if (filterString !== '') {
      filteredDatasets = datasets.filter((dataset) => {
        const lowercasedFilterString = filterString.toLowerCase()
        if (dataset.name.toLowerCase().includes(lowercasedFilterString)) return true
        if (dataset.title.toLowerCase().includes(lowercasedFilterString)) return true

        return false
      })
    }

    const listContent = filteredDatasets.length > 0
      ? filteredDatasets.map(({ id, title, name }) => (
        <div key={id} className='sidebar-list-item sidebar-list-item-text '>
          <div className='text'>{title}</div>
          <div className='subtext'>{name}</div>
        </div>
      ))
      : <div className='sidebar-list-item-text'>Oops, no matches found for <strong>&apos;{filterString}&apos;</strong></div>

    return (
      <div className='dataset-sidebar'>
        <div className='sidebar-list-item sidebar-list-item-text'>
          <div id='controls'>
            <input
              type='text'
              name='filter'
              placeholder='Filter'
              onKeyUp={(e) => this.handleFilterKeyUp(e)}
            />
            <div id='add-button'>Add</div>
          </div>
          <div className='strong-message'>You have {datasets.length} local datasets</div>
        </div>
        <div id='list'>
          {listContent}
        </div>
      </div>
    )
  }
}
