import React from 'react'
import { Action } from 'redux'
import path from 'path'

import { ApiAction } from '../../../store/api'
import { ToastType } from '../../../models/store'
import { QriRef } from '../../../models/qriRef'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'
import { setModal, openToast, closeToast } from '../../../actions/ui'
import { importFile } from '../../../actions/api'

import DropZone from '../../chrome/DropZone'
import DatasetList from './DatasetList'

export interface DatasetCollectionProps {
  qriRef: QriRef
  importFile: (filePath: string, fileName: string, fileSize: number) => Promise<ApiAction>
  openToast: (type: ToastType, name: string, message: string) => Action
  closeToast: () => Action
}

export const DatasetCollection: React.FunctionComponent<DatasetCollectionProps> = (props) => {
  const { importFile, openToast, closeToast } = props

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
    importFile,
    openToast,
    closeToast
  }
)
