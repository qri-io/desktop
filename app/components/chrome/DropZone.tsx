import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileMedical } from '@fortawesome/free-solid-svg-icons'

export interface DropZoneProps {
  title: string
  subtitle: string

  setDragging: (showing: boolean) => void
  onDrop: (e: React.SyntheticEvent) => void
}

const DropZone: React.FunctionComponent<DropZoneProps> = (props) => {
  const { title, subtitle, onDrop, setDragging } = props

  const setDragStateHandler = (showing: boolean) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault()
      setDragging(showing)
    }
  }

  return (<div className='drag-drop' id='drag-drop'
    onDragEnter={setDragStateHandler(true)}
    onDragOver={setDragStateHandler(true)}
    onDragExit={setDragStateHandler(false)}
    onDragEnd={setDragStateHandler(false)}
    onDrop={onDrop}
  >
    <div className="inner">
      <div className="icon"><FontAwesomeIcon size="5x" icon={faFileMedical} /></div>
      <div className="spacer">{title}</div>
      <a onClick={setDragStateHandler(false)}>cancel</a>
    </div>
    <div className="footer">{subtitle}</div>
  </div>)
}

export default DropZone
