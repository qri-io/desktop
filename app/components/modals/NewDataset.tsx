import * as React from 'react'

import { NewDatasetModal } from '../../models/modals'
import { connectComponentToProps } from '../../utils/connectComponentToProps'
import { dismissModal } from '../../actions/ui'
import { selectModal, selectSessionUsername } from '../../selections'
import nameFromTitle from '../../utils/nameFromTitle'

import Modal from './Modal'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'

interface NewDatasetProps {
  onDismissed: () => void
  modal: NewDatasetModal
  username: string
}

// 136 because dataset names cannot be longer than 144 characters,
// and we might have to prepend `dataset_` if the title begins with a number
const TITLE_CHARACTER_LIMIT = 136

export const NewDatasetComponent: React.FunctionComponent<NewDatasetProps> = (props) => {
  const {
    onDismissed,
    username
  } = props

  const [formValues, setFormValues] = React.useState({
    title: '',
    datasetName: ''
  })
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setButtonDisabled(formValues.title === '')
  }, [formValues.title])

  const handleTitleChange = (e: React.ChangeEvent) => {
    const { value } = e.target
    let datasetName
    if (!value.length) {
      datasetName = ''
    } else {
      datasetName = nameFromTitle(value)
    }
    setFormValues({ title: value, datasetName })
  }

  const handleSubmit = () => {
    const dataset = {
      meta: { title: formValues.title.trim() }
    }
    console.log(dataset)
    // TODO(chriswhong): make this create a new dataset
    setLoading(true)
    error && setError('')
    onDismissed()
  }

  return (
    <Modal
      id='new-dataset-modal'
      title='New Dataset'
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={true}
    >
      <div className='content-wrap' >
        <div className='content'>
          <div className='flex-space-between'>
            <TextInput
              name='title'
              label='Title'
              labelTooltip='Give your dataset a human-friendly title.'
              type=''
              value={formValues.title}
              onChange={handleTitleChange}
              maxLength={TITLE_CHARACTER_LIMIT}
              tooltipFor='modal-tooltip'
            />
          </div>
          {
            formValues.title !== '' && (
              <div className='dialog-text-small'>
                <p>
                  Your new dataset will be known on Qri as<br/>
                  <code>{username}/{formValues.datasetName}</code>
                </p>
                <p>Don&apos;t worry, you can change this later</p>
              </div>
            )
          }

        </div>
      </div>
      <Error id={'new-dataset-modal-error'} text={error} />
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Create'
        onSubmit={handleSubmit}
        disabled={buttonDisabled}
        loading={loading}
      />
    </Modal>
  )
}

export default connectComponentToProps(
  NewDatasetComponent,
  (state: any, ownProps: NewDatasetProps) => {
    return {
      ...ownProps,
      modal: selectModal(state),
      username: selectSessionUsername(state)
    }
  },
  {
    onDismissed: dismissModal
  }
)
