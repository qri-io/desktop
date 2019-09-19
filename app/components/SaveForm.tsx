import * as React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { Action } from 'redux'

import { validateCommitState } from '../utils/formValidation'
import { DatasetStatus } from '../models/store'
import { ApiAction } from '../store/api'

export interface SaveFormProps {
  isLoading: boolean
  status: DatasetStatus
  title: string
  message: string
  saveWorkingDataset: () => Promise<ApiAction>
  setCommitTitle: (title: string) => Action
  setCommitMessage: (message: string) => Action
}

const SaveForm: React.FunctionComponent<SaveFormProps> = (props: SaveFormProps) => {
  const {
    isLoading,
    status,
    saveWorkingDataset,
    title,
    message,
    setCommitTitle,
    setCommitMessage
  } = props

  const [isValid, setIsValid] = React.useState(false)

  React.useEffect(() => {
    // validate form -AND- make sure dataset status is in a commitable state
    const valid = validateCommitState(title, status)
    setIsValid(valid)
  }, [title, message, status])

  const handleChange = (e: any) => {
    const { name, value } = e.target

    if (name === 'title') setCommitTitle(value)
    if (name === 'message') setCommitMessage(value)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (isValid) {
      saveWorkingDataset()
        .then(() => {
          setCommitTitle('')
          setCommitMessage('')
        })
    }
  }

  return (
    <form id='save-form' onSubmit={handleSubmit}>
      <div className='title'>
        <input
          type='text'
          name='title'
          value={title}
          onChange={handleChange}
          placeholder='Commit message'
        />
      </div>
      <div className='message'>
        <textarea
          name='message'
          value={message}
          onChange={handleChange}
          placeholder='Detailed description'
        />
      </div>
      <div className='submit'>
        {
          isLoading
            ? <button className='spinner btn btn-primary'><FontAwesomeIcon icon={faSync} /> Saving...</button>
            : <button className={classNames('btn btn-primary', { 'disabled': !isValid })} type='submit'>Submit</button>
        }
      </div>
    </form>
  )
}

export default SaveForm
