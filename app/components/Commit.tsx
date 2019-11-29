import * as React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { Action } from 'redux'

import TextInput from './form/TextInput'
import TextAreaInput from './form/TextAreaInput'
import { validateCommitState } from '../utils/formValidation'
import { DatasetStatus } from '../models/store'
import { ApiAction } from '../store/api'

export interface CommitProps {
  isLoading: boolean
  datasetRef: string
  status: DatasetStatus
  title: string
  message: string
  saveWorkingDatasetAndFetch: () => Promise<ApiAction>
  setCommitTitle: (title: string) => Action
  setCommitMessage: (message: string) => Action
  setSelectedListItem: (type: string, selectedListItem: string) => Action
}

const Commit: React.FunctionComponent<CommitProps> = (props: CommitProps) => {
  const {
    isLoading,
    status,
    datasetRef,
    title,
    message,
    saveWorkingDatasetAndFetch,
    setCommitTitle,
    setCommitMessage,
    setSelectedListItem
  } = props

  const [isValid, setIsValid] = React.useState(false)

  React.useEffect(() => {
    // validate form -AND- make sure dataset status is in a commitable state
    const valid = validateCommitState(title, status)
    setIsValid(valid)
  }, [title, message, status])

  const handleChange = (name: string, value: string) => {
    if (name === 'title') setCommitTitle(value)
    if (name === 'message') setCommitMessage(value)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (isValid) {
      saveWorkingDatasetAndFetch()
        .then(() => {
          setCommitTitle('')
          setCommitMessage('')
          // set selected component to ''
          setSelectedListItem('component', '')
        })
    }
  }

  return (
    <div id='commit-component'>
      <div className='commit-section'>
        <h6> Commit Changes to </h6>
        <div className='dataset-ref'>{datasetRef}</div>
      </div>
      {/* <div className='commit-section'>
        <h6>change stats</h6>
        <img src='https://via.placeholder.com/271x70' />
      </div> */}
      <form id='commit-form' onSubmit={handleSubmit}>
        <TextInput
          name='title'
          label='Title'
          labelTooltip='Briefly describe these changes'
          type='text'
          value={title}
          placeHolder='Add a title'
          onChange={handleChange}
          maxLength={600}
        />
        <TextAreaInput
          name='message'
          label='Message'
          labelTooltip={'A detailed summary of the dataset\'s contents'}
          value={message}
          placeHolder='Add a title'
          onChange={handleChange}
          maxLength={600}
          rows={12}
        />
        <div className='submit'>
          {
            isLoading
              ? <button className='sync-spinner btn btn-primary'><FontAwesomeIcon icon={faSync} /> Saving...</button>
              : <button id='commit_submit' className={classNames('btn btn-primary btn-large', { 'disabled': !isValid })} type='submit'>Commit</button>
          }
        </div>
      </form>
    </div>
  )
}

export default Commit
