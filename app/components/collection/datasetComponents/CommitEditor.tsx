import React from 'react'
import { Action } from 'redux'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'

import Store, { Status, RouteProps } from '../../../models/store'
import { saveWorkingDatasetAndDirectToChangeReport } from '../../../actions/api'
import { setCommitTitle, setCommitMessage } from '../../../actions/mutations'
import { validateCommitState } from '../../../utils/formValidation'
import { ApiAction } from '../../../store/api'
import { selectIsCommiting, selectStatusFromMutations, selectMutationsCommit } from '../../../selections'
import { refStringFromQriRef, QriRef, qriRefFromRoute } from '../../../models/qriRef'

import TextInput from '../../form/TextInput'
import TextAreaInput from '../../form/TextAreaInput'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'

export interface CommitEditorProps extends RouteProps {
  qriRef: QriRef
  isSaving: boolean
  status: Status
  title: string
  message: string
  saveWorkingDatasetAndDirectToChangeReport: (username: string, name: string) => Promise<ApiAction>
  setCommitTitle: (title: string) => Action
  setCommitMessage: (message: string) => Action
}

export const CommitEditorComponent: React.FunctionComponent<CommitEditorProps> = (props) => {
  const {
    qriRef,
    isSaving,
    status,
    title,
    message,
    saveWorkingDatasetAndDirectToChangeReport,
    setCommitTitle,
    setCommitMessage
  } = props

  const [isValid, setIsValid] = React.useState(false)

  const { username, name } = qriRef

  // The `ReactTooltip` component relies on the `data-for` and `data-tip` attributes
  // we need to rebuild `ReactTooltip` so that it can recognize the `data-for`
  // or `data-tip` attributes that are rendered in this component
  React.useEffect(ReactTooltip.rebuild, [])

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
      saveWorkingDatasetAndDirectToChangeReport(username, name)
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
        <div className='dataset-ref'>{refStringFromQriRef(qriRef)}</div>
      </div>
      {/* <div className='commit-section'>
        <h6>change stats</h6>
        <img src='https://via.placeholder.com/271x70' />
      </div> */}
      <form id='commit-form' onSubmit={handleSubmit}>
        <TextInput
          name='title'
          label='Title'
          labelTooltip='Briefly describe the changes being made in this commit'
          type='text'
          value={title}
          placeHolder='Add a title'
          onChange={handleChange}
          maxLength={600}
        />
        <TextAreaInput
          name='message'
          label='Message'
          labelTooltip={'Provide a detailed description of the<br/>changes being made in this commit (optional)'}
          value={message}
          placeHolder='Add a message'
          onChange={handleChange}
          maxLength={600}
          rows={12}
        />
        <div className='submit'>
          {
            isSaving
              ? <button className='sync-spinner btn btn-large btn-primary'><FontAwesomeIcon icon={faSync} /> Saving...</button>
              : <button id='submit' className={classNames('btn btn-primary btn-large', { 'disabled': !isValid })} type='submit'>Commit</button>
          }
        </div>
      </form>
    </div>
  )
}

export default connectComponentToProps(
  CommitEditorComponent,
  (state: Store, ownProps: CommitEditorProps) => {
    const mutationsCommit = selectMutationsCommit(state)
    // get data for the currently selected component
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps),
      isSaving: selectIsCommiting(state),
      title: mutationsCommit.title,
      message: mutationsCommit.message,
      status: selectStatusFromMutations(state)
    }
  },
  {
    setCommitTitle,
    setCommitMessage,
    saveWorkingDatasetAndDirectToChangeReport
  }
)
