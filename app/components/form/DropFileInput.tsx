import React, { useRef, useState } from 'react'
import classNames from 'classnames'

import InputLabel from './InputLabel'

export interface DropFileInputProps {
  id: string
  label: string
  placeholder: string
  value: File
  labelTooltip?: string
  tooltipFor?: string
  subTitle?: string
  onChange: (f: File) => void
}

const DropFileInput: React.FunctionComponent<DropFileInputProps> = (props) => {
  const { id, label, tooltipFor, labelTooltip, placeholder = '', value, onChange } = props
  const fileInput = useRef(null)
  const [dragging, setDragging] = useState(false)

  const setDragStateHandler = (showing: boolean) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault()
      setDragging(showing)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onChange(e.dataTransfer.files[0])
  }

  return (
    <div className='drop-picker-container'>
      <InputLabel
        label={label}
        tooltip={labelTooltip}
        tooltipFor={tooltipFor}
      />
      <div
        id={id}
        className={classNames('drag-drop-picker', { dragging })}
        onClick={(e: React.SyntheticEvent) => { fileInput.current.click() }}
        onDragEnter={setDragStateHandler(true)}
        onDragOver={setDragStateHandler(true)}
        onDragExit={setDragStateHandler(false)}
        onDragEnd={setDragStateHandler(false)}
        onDrop={onDrop}
      >
        <div className="inner">
          {dragging && <div className='drop-zone'></div>}
          <input
            id={`${id}-input`}
            type='file'
            ref={fileInput}
            onChange={(e: React.FormEvent) => { onChange(e.target.files[0]) }}
            style={{ display: 'none' }}
          />
          <p className='label'>{(value.size > 0) ? value.name : placeholder }</p>
        </div>
      </div>
    </div>
  )
}

export default DropFileInput
