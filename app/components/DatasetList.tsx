import * as React from 'react'
import { Action, AnyAction } from 'redux'
import classNames from 'classnames'

import { MyDatasets, WorkingDataset } from '../models/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlink, faTimes } from '@fortawesome/free-solid-svg-icons'

import { Modal, ModalType } from '../models/modals'

interface DatasetListProps {
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  toggleDatasetList: () => Action
  setFilter: (filter: string) => Action
  setWorkingDataset: (peername: string, name: string, isLinked: boolean, published: boolean) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  setModal: (modal: Modal) => void
}

export default class DatasetList extends React.Component<DatasetListProps> {
  constructor (props: DatasetListProps) {
    super(props)
    this.handleEsc = this.handleEsc.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
  }

  handleEsc (e: KeyboardEvent) {
    if (e.key === 'Escape') this.props.toggleDatasetList()
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleEsc)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleEsc)
  }

  handleFilterChange (e: any) {
    const { setFilter } = this.props
    const filter = e.target.value
    setFilter(filter)
  }

  clearFilter () {
    this.props.setFilter('')
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

    const filteredDatasets = datasets.filter(({ peername, name, title }) => {
      // if there's a non-empty filter string, only show matches on peername, name, and title
      // TODO (chriswhong) replace this simple filtering with an API call for deeper matches
      if (filter !== '') {
        const lowercasedFilterString = filter.toLowerCase()
        if (peername.toLowerCase().includes(lowercasedFilterString)) return true
        if (name.toLowerCase().includes(lowercasedFilterString)) return true
        if (title && title.toLowerCase().includes(lowercasedFilterString)) return true
        return false
      }

      return true
    })

    const listContent = filteredDatasets.length > 0
      ? filteredDatasets.map(({ peername, name, title, isLinked, published }) => (
        <div
          key={`${peername}/${name}`}
          className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
            'selected': (peername === workingDataset.peername) && (name === workingDataset.name)
          })}
          onClick={() => setWorkingDataset(peername, name, isLinked, published)}
        >
          <div className='text-column'>
            <div className='text'>{peername}/{name}</div>
            <div className='subtext'>{title || <br/>}</div>
          </div>
          <div className='status-column' data-tip='unlinked'>
            {!isLinked && (
              <FontAwesomeIcon icon={faUnlink} size='sm'/>
            )}
          </div>

        </div>
      ))
      : <div className='sidebar-list-item-text'>Oops, no matches found for <strong>&apos;{filter}&apos;</strong></div>

    const countMessage = filteredDatasets.length !== datasets.length
      ? `Showing ${filteredDatasets.length} local dataset${filteredDatasets.length > 1 ? 's' : ''}`
      : `You have ${filteredDatasets.length} local dataset${datasets.length > 1 ? 's' : ''}`

    return (
      <div className='dataset-sidebar' >
        <div>
          <div id='buttons'>
            <div
              className='dataset-list-button'
              onClick={() => { setModal({ type: ModalType.AddDataset }) }}
              data-tip='Add an existing<br/>Qri dataset'
            >
              <a href='#'>Add a Dataset</a>
            </div>
            <div
              className='dataset-list-button'
              onClick={() => { setModal({ type: ModalType.CreateDataset }) }}
              data-tip='Create a new Qri <br/>dataset from a data file'
            >
              <a href='#'>New Dataset</a></div>
          </div>
        </div>
        <div id='dataset-list-header' className='sidebar-list-item'>
          <input
            type='text'
            name='filter'
            placeholder='Filter datasets'
            value={filter}
            onChange={(e) => this.handleFilterChange(e)}
          />
          { filter !== '' &&
            <a
              className='close'
              onClick={this.clearFilter}
              aria-label='close'
              role='button' ><FontAwesomeIcon icon={faTimes} size='lg'/>
            </a>
          }
        </div>
        <div id='list' onScroll={(e) => this.handleScroll(e)}>
          {listContent}
        </div>
        <div id='list-footer'>
          <div className='strong-message'>{countMessage}</div>
        </div>
      </div>
    )
  }
}
