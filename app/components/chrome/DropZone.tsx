import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileMedical } from '@fortawesome/free-solid-svg-icons'

export interface DropZoneProps {
  setDragging: (showing: boolean) => void
  onDrop: (e: React.SyntheticEvent) => void
}

const DropZone: React.FC<DropZoneProps> = (props) => {
  const { onDrop, setDragging } = props

  const setDragStateHandler = (showing: boolean) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault()
      setDragging(showing)
    }
  }

  return (<div className='drag-drop' id='drag-drop'
    onDragEnter={setDragStateHandler(true)}
    onDragOver={setDragStateHandler(true)}
    onDragLeave={setDragStateHandler(false)}
    onDragEnd={setDragStateHandler(false)}
    onDrop={onDrop}
  >
    <div className="inner">
      <div className="icon"><FontAwesomeIcon size="5x" icon={faFileMedical} /></div>
      <div className="spacer">Drop to Create a new dataset</div>
    </div>
    <div className="footer">You can import csv and json files</div>
  </div>)
}

export default DropZone
