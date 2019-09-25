import * as React from 'react'
import { Action, AnyAction } from 'redux'
import classNames from 'classnames'
import ContextMenuArea from 'react-electron-contextmenu'
import { shell, MenuItemConstructorOptions } from 'electron'

import { CurrentDataset } from './Dataset'
import { MyDatasets, WorkingDataset } from '../models/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlink, faTimes, faDownload, faPlus, faFileAlt } from '@fortawesome/free-solid-svg-icons'

import { Modal, ModalType } from '../models/modals'

interface DatasetListProps {
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  toggleDatasetList: () => Action
  setFilter: (filter: string) => Action
  setWorkingDataset: (peername: string, name: string) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  setModal: (modal: Modal) => void
}

export default class DatasetList extends React.Component<DatasetListProps> {
  constructor (props: DatasetListProps) {
    super(props)
    this.handleEsc = this.handleEsc.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
    this.renderNoDatasets = this.renderNoDatasets.bind(this)
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

  renderNoDatasets () {
    const { myDatasets } = this.props
    if (myDatasets.value.length !== 0) {
      return <div className='sidebar-list-item-text'>Oops, no matches found for <strong>&apos;{myDatasets.filter}&apos;</strong></div>
    }
    return (
      <div className='sidebar-list-item-text'>Your datasets will be listed here</div>)
  }

  render () {
    const {
      workingDataset,
      setModal,
      setWorkingDataset,
      toggleDatasetList,
      myDatasets
    } = this.props
    const { filter, value: datasets } = myDatasets
    const { peername, name } = workingDataset

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
      ? filteredDatasets.map(({ peername, name, title, fsiPath }) => {
        let menuItems: MenuItemConstructorOptions[] = [
          {
            label: 'Remove...',
            click: () => {
              setModal({
                type: ModalType.RemoveDataset,
                peername,
                name,
                fsiPath
              })
            }
          }
        ]

        if (fsiPath) {
          menuItems = [
            {
              label: 'Reveal in Finder',
              click: () => { shell.showItemInFolder(fsiPath) }
            },
            {
              type: 'separator'
            },
            ...menuItems
          ]
        }

        return (<ContextMenuArea menuItems={menuItems} key={`${peername}/${name}`}>
          <div
            key={`${peername}/${name}`}
            className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
              'selected': (peername === workingDataset.peername) && (name === workingDataset.name)
            })}
            onClick={() => setWorkingDataset(peername, name)}
          >
            <div className='icon-column'>
              <FontAwesomeIcon icon={faFileAlt} size='lg'/>
            </div>
            <div className='text-column'>
              <div className='text'>{peername}/{name}</div>
              <div className='subtext'>{title || <br/>}</div>
            </div>
            <div className='status-column' data-tip='unlinked'>
              {!fsiPath && (
                <FontAwesomeIcon icon={faUnlink} size='sm'/>
              )}
            </div>

          </div>
        </ContextMenuArea>)
      }
      )
      : this.renderNoDatasets()

    const countMessage = filteredDatasets.length !== datasets.length
      ? `Showing ${filteredDatasets.length} local dataset${filteredDatasets.length !== 1 ? 's' : ''}`
      : `You have ${filteredDatasets.length} local dataset${datasets.length !== 1 ? 's' : ''}`

    return (
      <>
        <div id='dataset-list-header'>
          <CurrentDataset
            onClick={toggleDatasetList}
            expanded={true}
            peername={peername}
            name={name}
          />
        </div>
        <div className='dataset-sidebar' >
          <div id='dataset-list-filter' className='sidebar-list-item'>
            <div id='dataset-list-buttons'>
              <div
                className='dataset-list-button btn btn-primary'
                onClick={() => { setModal({ type: ModalType.AddDataset }) }}
                data-tip='Copy an existing<br/>Qri dataset to your computer'
              >
                <FontAwesomeIcon icon={faDownload} />&nbsp;&nbsp;
                <span>Add from Network</span>
              </div>
              <div
                className='dataset-list-button btn btn-primary'
                onClick={() => { setModal({ type: ModalType.CreateDataset }) }}
                data-tip='Create a new Qri <br/>dataset from a data file'
              >
                <FontAwesomeIcon icon={faPlus} />&nbsp;&nbsp;
                <span>Create New</span>
              </div>
            </div>
            <div className='filter-input-container'>
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
          </div>
          <div id='list' onScroll={(e) => this.handleScroll(e)}>
            {listContent}
          </div>
          <div id='list-footer'>
            <div className='strong-message'>{countMessage}</div>
          </div>
        </div>
      </>
    )
  }
}
