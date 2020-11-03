import React, { useState } from 'react'
import { Action } from 'redux'
import path from 'path'

import { setModal, openToast, closeToast } from '../../../actions/ui'
import { Modal, ModalType } from '../../../models/modals'
import { QriRef } from '../../../models/qriRef'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'

import DropZone from '../../chrome/DropZone'
import DatasetList from './DatasetList'

export interface DatasetCollectionProps {
  qriRef: QriRef
  setModal: (modal: Modal) => void
  openToast: (type: ToastType, name: string, message: string) => Action
  closeToast: () => Action
}

export const DatasetCollection: React.FunctionComponent<DatasetCollectionProps> = (props) => {
  const { setModal, openToast, closeToast } = props

  const [dragging, setDragging] = useState(false)

  const setDragStateHandler = (dragState: boolean) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault()
      setDragging(dragState)
    }
  }

  const dropHandler = (e: React.DragEvent) => {
    setDragging(false)
    e.preventDefault()
    const ext = path.extname(e.dataTransfer.files[0].path)
    closeToast()
    if (!(ext === '.csv' || ext === '.json')) {
      // open toast for 1 second
      openToast('error', 'drag-drop', 'unsupported file format: only json and csv supported')
      setTimeout(() => closeToast(), 2500)
      return
    }

    setModal({ type: ModalType.NewDataset, bodyFile: event.dataTransfer.files[0] })
  }

  return (
    <div className='main-content-flex' onDragEnter={setDragStateHandler(true)}>
      {!__BUILD__.REMOTE && dragging && <DropZone
        title='Drop to create a new dataset'
        subtitle='You can import csv and json files'
        setDragging={setDragging}
        onDrop={dropHandler}
      />}
      <div className='main-content-flex'>
        <DatasetList showFSI />
      </div>
    </div>
  )
}

export default connectComponentToProps(
  DatasetCollection,
  {},
  {
    setModal,
    openToast,
    closeToast
  }
)
