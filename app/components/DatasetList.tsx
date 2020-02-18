import * as React from 'react'
import { Action, AnyAction } from 'redux'
import ContextMenuArea from 'react-electron-contextmenu'
import { withRouter } from 'react-router-dom'
import { shell, MenuItemConstructorOptions } from 'electron'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { Modal, ModalType } from '../models/modals'
import { MyDatasets, WorkingDataset, VersionInfo } from '../models/store'
import ProgressBar from './chrome/ProgressBar'
import VersionInfoItem from './item/VersionInfoItem'

// for displaying a progress bar based on import file size
// assumes an import rate of 4828 bytes per millisecond
const IMPORT_BYTES_PER_MS = 4828

interface DatasetListProps {
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  importFileName: string
  importFileSize: number

  setFilter: (filter: string) => Action
  setWorkingDataset: (peername: string, name: string) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  setModal: (modal: Modal) => void
}

class DatasetList extends React.Component<DatasetListProps> {
  constructor (props: DatasetListProps) {
    super(props)
    this.clearFilter = this.clearFilter.bind(this)
    this.renderNoDatasets = this.renderNoDatasets.bind(this)
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
      <div id='no-datasets' className='sidebar-list-item-text'>Your datasets will be listed here</div>)
  }

  render () {
    const {
      workingDataset,
      setModal,
      setWorkingDataset,
      myDatasets,
      importFileName,
      importFileSize
    } = this.props

    const { filter, value: datasets } = myDatasets

    const filteredDatasets = datasets.filter(({ username, name, metaTitle = '' }) => {
      // if there's a non-empty filter string, only show matches on peername, name, and title
      // TODO (chriswhong) replace this simple filtering with an API call for deeper matches
      if (filter !== '') {
        const lowercasedFilterString = filter.toLowerCase()
        if (username.toLowerCase().includes(lowercasedFilterString)) return true
        if (name.toLowerCase().includes(lowercasedFilterString)) return true
        if (metaTitle.toLowerCase().includes(lowercasedFilterString)) return true
        return false
      }
      return true
    })

    const listContent = filteredDatasets.length > 0
      ? filteredDatasets.map((ddr: VersionInfo) => {
        const { username, name, fsiPath } = ddr
        let menuItems: MenuItemConstructorOptions[] = [
          {
            label: 'Remove...',
            click: () => {
              setModal({
                type: ModalType.RemoveDataset,
                peername: username,
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

        return (<ContextMenuArea menuItems={menuItems} key={`${username}/${name}`}>
          <VersionInfoItem
            data={ddr}
            selected={(username === workingDataset.peername) && (name === workingDataset.name)}
            onClick={(data: VersionInfo) => {
              setWorkingDataset(data.username, data.name)
                .then(() => {
                  this.props.history.push(`/workbench/${data.username}/${name}`)
                })
            }}
          />
        </ContextMenuArea>)
      }
      )
      : this.renderNoDatasets()

    const countMessage = filteredDatasets.length !== datasets.length
      ? `Showing ${filteredDatasets.length} local dataset${filteredDatasets.length !== 1 ? 's' : ''}`
      : `You have ${filteredDatasets.length} local dataset${datasets.length !== 1 ? 's' : ''}`

    // calculate the duration estimate based on the importFileSize
    const importTimeEstimate = importFileSize / IMPORT_BYTES_PER_MS

    return (
      <div id='dataset-list'>
        <div className='sidebar' >
          <div className='sidebar-header sidebar-padded-container'>
            <p className='pane-title'>Collection</p>
          </div>
          <div id='dataset-list-filter'>
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
            {(importFileSize > 0)
              ? <ProgressBar duration={importTimeEstimate} fileName={importFileName} />
              : <div className='strong-message'>{countMessage}</div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(DatasetList)
