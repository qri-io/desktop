import * as React from 'react'
import { Action, AnyAction } from 'redux'
import classNames from 'classnames'
import { MyDatasets, WorkingDataset } from '../models/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'

import { Modal, ModalType } from '../models/modals'

interface DatasetListProps {
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  setFilter: (filter: string) => Action
  setWorkingDataset: (peername: string, name: string, isLinked: boolean) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  setModal: (modal: Modal) => void
}

export default class DatasetList extends React.Component<DatasetListProps> {
  handleFilterKeyUp (e: any) {
    const { setFilter } = this.props
    const filter = e.target.value
    setFilter(filter)
  }

  handleScroll (e: any) {
    const { myDatasets } = this.props
    // this assumes myDatasets is being called for the first time by the App component
    if (!myDatasets.pageInfo) return
    if (e.target.scrollHeight === parseInt(e.target.scrollTop) + parseInt(e.target.offsetHeight)) {
      this.props.fetchMyDatasets(myDatasets.pageInfo.page + 1, myDatasets.pageInfo.pageSize)
    }
  }

  render () {
    const { workingDataset, setModal } = this.props
    const { setWorkingDataset } = this.props
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
      ? filteredDatasets.map(({ peername, name, title, isLinked }) => (
        <div
          key={`${peername}/${name}`}
          className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
            'selected': (peername === workingDataset.peername) && (name === workingDataset.name)
          })}
          onClick={() => setWorkingDataset(peername, name, isLinked)}
        >
          <div className='text-column'>
            <div className='text'>{title}</div>
            <div className='subtext'>{name}</div>
          </div>
          <div className='status-column'>
            {isLinked && <FontAwesomeIcon icon={faFolderOpen} size='sm'/>}
          </div>

        </div>
      ))
      : <div className='sidebar-list-item-text'>Oops, no matches found for <strong>&apos;{filter}&apos;</strong></div>

    return (
      <div className='dataset-sidebar' >
        <div id='dataset-list-header' className='sidebar-list-item'>
          <div id='controls'>
            <input
              type='text'
              name='filter'
              placeholder='Filter'
              onKeyUp={(e) => this.handleFilterKeyUp(e)}
            />
            <div id='add-button' onClick={() => { setModal({ type: ModalType.AddDataset }) }}>Add</div>
          </div>
          <div className='strong-message'>You have {filteredDatasets.length} local datasets</div>
        </div>
        <div id='list' onScroll={(e) => this.handleScroll(e)}>
          {listContent}
        </div>
      </div>
    )
  }
}
