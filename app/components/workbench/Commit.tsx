import * as React from 'react'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

import Store, { Status } from '../../models/store'
import { saveWorkingDatasetAndFetch } from '../../actions/api'
import { setCommitTitle, setCommitMessage } from '../../actions/mutations'
import { validateCommitState } from '../../utils/formValidation'
import { ApiAction } from '../../store/api'

import TextInput from '../form/TextInput'
import TextAreaInput from '../form/TextAreaInput'

export interface CommitProps {
  isLoading: boolean
  datasetRef: string
  status: Status
  title: string
  message: string
  saveWorkingDatasetAndFetch: () => Promise<ApiAction>
  setCommitTitle: (title: string) => Action
  setCommitMessage: (message: string) => Action
}

export const CommitComponent: React.FC<CommitProps> = (props) => {
  const {
    isLoading,
    status,
    datasetRef,
    title,
    message,
    saveWorkingDatasetAndFetch,
    setCommitTitle,
    setCommitMessage
  } = props

  const [isValid, setIsValid] = React.useState(false)

  React.useEffect(() => {
    // validate form -AND- make sure dataset status is in a commitable state
    const valid = validateCommitState(title, status)
    setIsValid(valid)
  }, [title, message, status])

  const handleChange = (e: React.ChangeEvent) => {
    if (e.target.name === 'title') setCommitTitle(e.target.value)
    if (e.target.name === 'message') setCommitMessage(e.target.value)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (isValid) {
      saveWorkingDatasetAndFetch()
        .then(() => {
          setCommitTitle('')
          setCommitMessage('')
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
              ? <button className='sync-spinner btn btn-large btn-primary'><FontAwesomeIcon icon={faSync} /> Saving...</button>
              : <button id='submit' className={classNames('btn btn-primary btn-large', { 'disabled': !isValid })} type='submit'>Commit</button>
          }
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state: Store) => {
  const { workingDataset, mutations } = state
  const { status, peername, name } = workingDataset
  const { save } = mutations
  const { title, message } = save.value

  // get data for the currently selected component
  return {
    isLoading: mutations.save.isLoading,
    datasetRef: `${peername}/${name}`,
    title,
    message,
    status
  }
}

const mergeProps = (props: any, actions: any): CommitProps => { //eslint-disable-line
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setCommitTitle,
    setCommitMessage,
    saveWorkingDatasetAndFetch
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CommitComponent)
