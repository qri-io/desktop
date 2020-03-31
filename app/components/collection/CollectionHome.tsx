import React from 'react'
import { Action } from 'redux'
import path from 'path'
import { faPlus, faDownload } from '@fortawesome/free-solid-svg-icons'

import { ApiAction } from '../../store/api'
import { Modal, ModalType } from '../../models/modals'
import { ToastTypes } from '../chrome/Toast'
import { ToastType } from '../../models/store'

import HeaderColumnButton from '../chrome/HeaderColumnButton'
import WelcomeTemplate from '../onboard/WelcomeTemplate'
import DropZone from '../chrome/DropZone'

export interface CollectionHomeProps {
  setModal: (modal: Modal) => void
  importFile: (filePath: string, fileName: string, fileSize: number) => Promise<ApiAction>
  openToast: (type: ToastType, name: string, message: string) => Action
  closeToast: () => Action
}

const CollectionHome: React.FunctionComponent<CollectionHomeProps> = (props) => {
  const { setModal, importFile, openToast, closeToast } = props

  const [dragging, setDragging] = React.useState(false)

  const setDragStateHandler = (dragState: boolean) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault()
      setDragging(dragState)
    }
  }

  const dropHandler = (event: React.DragEvent) => {
    setDragging(false)
    event.preventDefault()
    const ext = path.extname(event.dataTransfer.files[0].path)
    closeToast()
    if (!(ext === '.csv' || ext === '.json')) {
      // open toast for 1 second
      openToast(ToastTypes.error, 'drag-drop', 'unsupported file format: only json and csv supported')
      setTimeout(() => closeToast(), 2500)
      return
    }

    const {
      path: filePath,
      name: fileName,
      size: fileSize
    } = event.dataTransfer.files[0]
    importFile(filePath, fileName, fileSize)
  }

  return (
    <div className='main-content-flex' onDragEnter={setDragStateHandler(true)}>
      {dragging && <DropZone
        title='Drop to create a new dataset'
        subtitle='You can import csv and json files'
        setDragging={setDragging}
        onDrop={dropHandler}
      />}
      <div className='main-content-header'>
        <HeaderColumnButton
          id='create-dataset'
          icon={faPlus}
          label='Create new Dataset'
          onClick={() => { setModal({ type: ModalType.CreateDataset }) }}
        />
        <HeaderColumnButton
          icon={faDownload}
          id='add-dataset'
          label='Add existing Dataset'
          onClick={() => { setModal({ type: ModalType.AddDataset }) }}
        />
      </div>
      <div className='main-content-flex'>
        <WelcomeTemplate
          title='Welcome to Qri!'
          subtitle={`drop a file to create a new dataset`}
          id='drop-file'
          loading={false}
          fullscreen={false}
        />
      </div>
    </div>
  )
}

export default CollectionHome
