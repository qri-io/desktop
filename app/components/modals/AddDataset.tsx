import * as React from 'react'
import { CSSTransition } from 'react-transition-group'

import { ApiAction } from '../../store/api'

import { validateDatasetReference } from '../../utils/formValidation'
import { connectComponentToProps } from '../../utils/connectComponentToProps'

import { addDatasetAndFetch } from '../../actions/api'
import { dismissModal } from '../../actions/ui.TARGET_PLATFORM'

import Modal from './Modal'
import ExternalLink from '../ExternalLink.TARGET_PLATFORM'
import DebouncedTextInput from '../form/DebouncedTextInput'
import Error from './Error'
import Buttons from './Buttons'

interface AddDatasetProps {
  // func to call when we cancel or click away from the modal
  onDismissed: () => void
  // func to call when we hit submit, this adds the dataset from the network
  addDatasetAndFetch: (peername: string, name: string) => Promise<ApiAction>
}

const AddDatasetComponent: React.FunctionComponent<AddDatasetProps> = (props) => {
  const {
    onDismissed,
    addDatasetAndFetch
  } = props

  const [datasetReference, setDatasetReference] = React.useState('')

  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [datasetReferenceError, setDatasetReferenceError] = React.useState('')

  React.useEffect(() => {
    const datasetReferenceValidationError = validateDatasetReference(datasetReference)
    datasetReferenceValidationError ? setDatasetReferenceError(datasetReferenceValidationError) : setDatasetReferenceError('')
  }, [datasetReference])

  // should come from props
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleChanges = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    if (error !== '') setError('')
    if (name === 'datasetName') setDatasetReference(value)
    setButtonDisabled(value === '')
  }

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')

    if (!addDatasetAndFetch) return
    const [peername, datasetName] = datasetReference.split('/')

    addDatasetAndFetch(peername, datasetName)
      .then(() => { onDismissed() })
      .catch((action) => {
        setDismissable(true)
        setLoading(false)
        setError(action.payload.err.message)
      })
  }

  return (
    <Modal
      id="add_modal"
      title={'Add an Existing Qri Dataset'}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div>
          <div className='content'>
            <p>Add an existing dataset by entering its dataset reference, like <span className='code-highlight'>b5/world_bank_population</span></p>
            <p>Search for datasets on <ExternalLink href='https://qri.cloud'>Qri Cloud</ExternalLink>.</p>
            <DebouncedTextInput
              name='datasetName'
              label='Dataset Reference'
              labelTooltip={'Qri dataset references use [username]/[datasetname] format'}
              tooltipFor='modal-tooltip'
              type=''
              value={datasetReference}
              onChange={handleChanges}
              errorText={datasetReferenceError}
              maxLength={300}
            />
          </div>
        </div>
        <CSSTransition
          in={!!error}
          timeout={300}
          classNames='slide'
          component='div'
        >
          <div id='error'><Error id='add' text={error} /></div>
        </CSSTransition>
      </div>
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Add Dataset'
        onSubmit={handleSubmit}
        disabled={buttonDisabled}
        loading={loading}
      />
    </Modal>
  )
}

export default connectComponentToProps(
  AddDatasetComponent,
  (state: any, ownProps: AddDatasetProps) => {
    return ownProps
  },
  {
    addDatasetAndFetch,
    onDismissed: dismissModal
  }
)
