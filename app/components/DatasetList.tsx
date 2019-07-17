import * as React from 'react'

export interface DatasetListProps {
  value: any[]
}

export class DatasetList extends React.Component<DatasetListProps, { activeTab: string, filterString: string }> {
  constructor (p: DatasetListProps) {
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
    const datasets = this.props.value
    let filteredDatasets = datasets
    const { filterString } = this.state

    if (filterString !== '') {
      filteredDatasets = filteredDatasets.filter((dataset) => {
        const lowercasedFilterString = filterString.toLowerCase()
        if (dataset.name.toLowerCase().includes(lowercasedFilterString)) return true
        if (dataset.title.toLowerCase().includes(lowercasedFilterString)) return true

        return false
      })
    }

    const listContent = filteredDatasets.length > 0
      ? filteredDatasets.map(({ title, name, path }) => (
        <div key={path} className='sidebar-list-item sidebar-list-item-text '>
          <div className='text'>{title}</div>
          <div className='subtext'>{name}</div>
        </div>
      ))
      : <div className='sidebar-list-item-text'>Oops, no matches found for <strong>&apos;{filterString}&apos;</strong></div>

    return (
      <div className='dataset-sidebar'>
        <div id='dataset-list-header' className='sidebar-list-item'>
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
