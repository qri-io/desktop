import * as React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

import { DatasetStatus } from '../models/store'
import { ApiAction } from '../store/api'

interface SaveFormProps {
  isLoading: boolean
  status: DatasetStatus
  saveWorkingDataset: () => Promise<ApiAction>
}

const SaveForm: React.FunctionComponent<SaveFormProps> = (props: SaveFormProps) => {
  const {
    isLoading,
    status,
    saveWorkingDataset
  } = props

  const [isValid, setIsValid] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [message, setMessage] = React.useState('')

  React.useEffect(() => {
    // validate form -AND- make sure dataset status is in a commitable state
    let valid = true
    // commit message (title) must be more than 3 characters
    if (title.length < 4) valid = false

    const statuses: string[] = Object.keys(status).map((key) => status[key].status)

    // status must include at least one 'modified'
    const noModified = !statuses.includes('modified')
    if (noModified) valid = false

    const hasErrors = statuses.reduce((acc, status) => {
      return status.match(/error/g) ? true : acc
    }, false)
    if (hasErrors) valid = false

    setIsValid(valid)
  }, [title, message, status])

  const handleChange = (e: any) => {
    const { name, value } = e.target

    if (name === 'title') setTitle(value)
    if (name === 'message') setMessage(value)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (isValid) {
      saveWorkingDataset()
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
