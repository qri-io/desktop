import * as React from 'react'
import { Action } from 'redux'
import { MyDatasets, WorkingDataset } from '../models/store'

interface DatasetListProps {
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  setFilter: (filter: string) => Action
  setWorkingDataset: (peername: string, name: string) => Action
}

export default class DatasetList extends React.Component<DatasetListProps> {
  handleFilterKeyUp (e: any) {
    const { setFilter } = this.props
    const filter = e.target.value
    setFilter(filter)
  }

  render () {
    const { setWorkingDataset } = this.props
    console.log(this.props)
    const { filter, value: datasets } = this.props.myDatasets

    const filteredDatasets = datasets.filter(({ name, title }) => {
      // if there's a non-empty filter string, only show matches on name and title
      // TODO (chriswhong) replace this simple filtering with an API call for deeper matches
      if (filter !== '') {
        const lowercasedFilterString = filter.toLowerCase()
        if (name.toLowerCase().includes(lowercasedFilterString)) return true
        if (title.toLowerCase().includes(lowercasedFilterString)) return true
        return false
      }

      return true
    })

    const listContent = filteredDatasets.length > 0
      ? filteredDatasets.map(({ peername, name, path, title }) => (
        <div
          key={path}
          className='sidebar-list-item sidebar-list-item-text'
          onClick={() => setWorkingDataset(peername, name)}
        >
          <div className='text-column'>
            <div className='text'>{title}</div>
            <div className='subtext'>{name}</div>
          </div>
        </div>
      ))
      : <div className='sidebar-list-item-text'>Oops, no matches found for <strong>&apos;{filter}&apos;</strong></div>

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
          <div className='strong-message'>You have {filteredDatasets.length} local datasets</div>
        </div>
        <div id='list'>
          {listContent}
        </div>
      </div>
    )
  }
}
