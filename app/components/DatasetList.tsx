import * as React from 'react'
import { Action, AnyAction } from 'redux'
import classNames from 'classnames'
import ContextMenuArea from 'react-electron-contextmenu'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { shell, MenuItemConstructorOptions } from 'electron'
import filesize from 'filesize'
import { Line } from 'rc-progress'

import { MyDatasets, WorkingDataset } from '../models/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { faFile, faClock } from '@fortawesome/free-regular-svg-icons'

import { Modal, ModalType } from '../models/modals'

// for displaying a progress bar based on import file size
// assumes an import rate of 4828 bytes per millisecond
const IMPORT_BYTES_PER_MS = 4828

interface ImportProgressBarProps {
  duration: number
  fileName: string
}

const ImportProgressBar: React.FunctionComponent<ImportProgressBarProps> = ({ duration, fileName }) => {
  const timeForOnePercent = duration / 100 // milliseconds
  const [ percent, setPercent ] = React.useState(0)

  let timer = setTimeout(() => {})

  const increase = () => {
    setPercent(percent + 1)
  }

  React.useEffect(() => {
    if (percent >= 100) {
      clearTimeout(timer)
      return
    }
    timer = setTimeout(increase, timeForOnePercent)
  }, [ percent ])

  React.useEffect(() => {
    increase()
  }, [])

  return (
    <div className=''>
      <div className='import-message'>importing {fileName}...</div>
      <Line percent={percent} strokeWidth={4} strokeColor='#4FC7F3' />
    </div>
  )
}

// component for rendering dataset format, timestamp, size, etc
export interface DatasetDetailsSubtextProps {
  format?: string
  lastCommit?: string
  commitCount?: number
  length?: number
}

export const DatasetDetailsSubtext: React.FunctionComponent<DatasetDetailsSubtextProps> = ({ format, lastCommit, commitCount, length }) => {
  return (
    <div className='dataset-details'>
      {format && <span className='dataset-details-item'> {format}</span>}
      {lastCommit && <span className='dataset-details-item'><FontAwesomeIcon icon={faClock} size='sm'/> {moment(lastCommit).fromNow()}</span>}
      {commitCount && <span className='dataset-details-item'>{`${commitCount} commit${commitCount !== 1 ? 's' : ''}`}</span>}
      {length && <span className='dataset-details-item'><FontAwesomeIcon icon={faFile} size='sm'/> {filesize(length)}</span>}
    </div>
  )
}

interface DatasetListProps {
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  setFilter: (filter: string) => Action
  setWorkingDataset: (peername: string, name: string) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  setModal: (modal: Modal) => void
  importFileName: string
  importFileSize: number
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
      <div className='sidebar-list-item-text'>Your datasets will be listed here</div>)
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
      ? filteredDatasets.map((dataset) => {
        const { peername, name, fsiPath } = dataset
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

        let subtext = <>&nbsp;</>

        if (dataset.dataset) {
          const { format, length } = dataset.dataset.structure
          const { timestamp: lastCommit } = dataset.dataset.commit
          subtext = (
            <DatasetDetailsSubtext
              format={format}
              lastCommit={lastCommit}
              length={length}
            />
          )
        }

        return (<ContextMenuArea menuItems={menuItems} key={`${peername}/${name}`}>
          <div
            key={`${peername}/${name}`}
            className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
              'selected': (peername === workingDataset.peername) && (name === workingDataset.name)
            })}
            onClick={() => {
              setWorkingDataset(peername, name)
                .then(() => {
                  this.props.history.push('/dataset')
                })
            }}
          >
            <div className='icon-column'>
              <FontAwesomeIcon icon={faFileAlt} size='lg'/>
            </div>
            <div className='text-column'>
              <div className='text'>{peername}/{name}</div>
              {subtext}
            </div>
          </div>
        </ContextMenuArea>)
      }
      )
      : this.renderNoDatasets()

    const countMessage = filteredDatasets.length !== datasets.length
      ? `Showing ${filteredDatasets.length} local dataset${filteredDatasets.length !== 1 ? 's' : ''}`
      : `You have ${filteredDatasets.length} local dataset${datasets.length !== 1 ? 's' : ''}`

    // calculate the duration estimate based on the importFileSize
    const importTimeEstimate = importFileSize / IMPORT_BYTES_PER_MS

    const footerContent = importFileSize > 0 ? (
      <ImportProgressBar duration={importTimeEstimate} fileName={importFileName} />
    ) : (
      <div className='strong-message'>{countMessage}</div>
    )

    return (
      <div id='dataset-list'>
        <div className='dataset-sidebar' >
          <div className='dataset-sidebar-header sidebar-padded-container'>
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
            {footerContent}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(DatasetList)
