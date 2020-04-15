import * as React from 'react'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { RouteComponentProps } from 'react-router-dom'

import Store, { Status } from '../../../models/store'
import { saveWorkingDatasetAndFetch } from '../../../actions/api'
import { setCommitTitle, setCommitMessage } from '../../../actions/mutations'
import { validateCommitState } from '../../../utils/formValidation'
import { ApiAction } from '../../../store/api'
import { selectIsCommiting, selectStatusFromMutations, selectMutationsCommit } from '../../../selections'
import { refStringFromQriRef, QriRef, qriRefFromRoute } from '../../../models/qriRef'

import TextInput from '../../form/TextInput'
import TextAreaInput from '../../form/TextAreaInput'

export interface CommitEditorProps extends RouteComponentProps<QriRef> {
  qriRef: QriRef
  isSaving: boolean
  status: Status
  title: string
  message: string
  saveWorkingDatasetAndFetch: (username: string, name: string) => Promise<ApiAction>
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
    saveWorkingDatasetAndFetch,
    setCommitTitle,
    setCommitMessage
  } = props

  const [isValid, setIsValid] = React.useState(false)

  const { username, name } = qriRef

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
      saveWorkingDatasetAndFetch(username, name)
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
            isSaving
              ? <button className='sync-spinner btn btn-large btn-primary'><FontAwesomeIcon icon={faSync} /> Saving...</button>
              : <button id='submit' className={classNames('btn btn-primary btn-large', { 'disabled': !isValid })} type='submit'>Commit</button>
          }
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state: Store, ownProps: CommitEditorProps) => {
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
}

const mergeProps = (props: any, actions: any): CommitEditorProps => { //eslint-disable-line
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setCommitTitle,
    setCommitMessage,
    saveWorkingDatasetAndFetch
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CommitEditorComponent)
