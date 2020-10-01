import * as React from 'react'

import { Dataset } from '../../../app/models/dataset'
import { ExportDatasetModal } from '../../../app/models/modals'
import { ApiAction } from '../../store/api'
import { connectComponentToProps } from '../../utils/connectComponentToProps'
import { dismissModal } from '../../actions/ui'
import {
  selectModal,
  selectDatasetUsername,
  selectDatasetName,
  selectDatasetPath,
  selectDataset
} from '../../selections'

import CheckboxInput from '../form/CheckboxInput'
import RadioInput from '../form/RadioInput'
import Modal from './Modal'
import Error from './Error'
import Buttons from './Buttons'
import CommitDetails from '../CommitDetails'

interface ExportDatasetProps {
  modal: ExportDatasetModal
  username: string
  name: string
  path: string
  dataset: Dataset
  onDismissed: () => void
  onSubmit: () => Promise<ApiAction>
}

export const ExportDatasetComponent: React.FunctionComponent<ExportDatasetProps> = (props: ExportDatasetProps) => {
  const { username, name, path, dataset, onDismissed, onSubmit } = props
  const { commit, structure, meta, readme } = dataset

  const [dismissable, setDismissable] = React.useState(true)

  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const [ bodyChecked, setBodyChecked ] = React.useState(true)
  const [ bodyFormat, setBodyFormat ] = React.useState('csv')

  // otherChecked has three states, 'true', 'false', 'indeterminate'
  // indeterminate state means the checkbox shows a '-' instead of checked or unchecked
  const [ otherChecked, setOtherChecked ] = React.useState('false')

  const [ metaChecked, setMetaChecked ] = React.useState(false)
  const [ structureChecked, setStructureChecked ] = React.useState(false)
  const [ readmeChecked, setReadmeChecked ] = React.useState(false)

  const enabledOtherComponents = ['structure'] // structure is always enabled
  if (meta) enabledOtherComponents.push('meta')
  if (readme) enabledOtherComponents.push('readme')

  // whenever a child checkbox is changed, determine the state of the parent
  // checkbox by comparing count of checked boxes to the count of enabled boxes
  React.useEffect(() => {
    const enabledCount = enabledOtherComponents.length

    const checkedCount = [metaChecked, structureChecked, readmeChecked].reduce((acc, curr) => {
      return acc + (curr ? 1 : 0)
    }, 0)

    // set state of parent checkbox
    if (checkedCount === 0) {
      setOtherChecked('false')
    } else if (checkedCount === enabledCount) {
      setOtherChecked('true')
    } else {
      setOtherChecked('indeterminate')
    }
  }, [metaChecked, structureChecked, readmeChecked])

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')
    if (!onSubmit) return

    alert('Exporting Files!')
  }

  // set all to true or all to false
  const setEnabledOtherCheckboxes = (value) => {
    enabledOtherComponents.forEach((d) => {
      if (d === 'meta') setMetaChecked(value)
      if (d === 'structure') setStructureChecked(value)
      if (d === 'readme') setReadmeChecked(value)
    })
  }

  // handle user click on parent checkbox
  const handleOtherChange = () => {
    // if it was unchecked or indeterminate, check all enabled sub-boxes
    if (otherChecked !== 'true') {
      setEnabledOtherCheckboxes(true)
      setOtherChecked('true')
    } else { // if it was checked, uncheck all sub-boxes
      setEnabledOtherCheckboxes(false)
      setOtherChecked('false')
    }
  }

  return (
    <Modal
      id='export-dataset'
      title='Export Dataset'
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div className='content'>
          <div className='export-dataset-info'>
            <div className='dialog-text-small'>
              <code style={{ marginBottom: '15px' }}>{username}/{name}</code><br/>
              {
                structure && commit && (
                  <CommitDetails commit={commit} structure={structure} path={path} />
                )
              }
            </div>
          </div>
          <div className='dialog-text-small'>
            <div className='input-label'>Components</div>

            <div className='options-row'>
              <div className='options-column'>
                <CheckboxInput
                  name='body'
                  checked={bodyChecked}
                  onChange={() => { setBodyChecked(!bodyChecked) }}
                  label='Body'
                  strong
                />
                <div className='options-column-content'>
                  <RadioInput
                    name='csv'
                    checked={bodyFormat === 'csv'}
                    onChange={() => { setBodyFormat('csv') }}
                    label='body.csv'
                    disabled={bodyChecked === false}
                  />
                  <RadioInput
                    name='should-remove-files'
                    checked={bodyFormat === 'json'}
                    onChange={() => { setBodyFormat('json') }}
                    label='body.json'
                    disabled={bodyChecked === false}
                  />
                </div>
              </div>
              <div className='options-column'>
                <CheckboxInput
                  name='other-components'
                  checked={otherChecked === 'true'}
                  onChange={handleOtherChange}
                  indeterminate={otherChecked === 'indeterminate'}
                  label='Other Components'
                  strong
                />
                <div className='options-column-content'>
                  <CheckboxInput
                    name='meta'
                    checked={metaChecked}
                    onChange={() => { setMetaChecked(!metaChecked) }}
                    label='meta.json'
                    disabled={meta === undefined}
                  />
                  <CheckboxInput
                    name='structure'
                    checked={structureChecked}
                    onChange={() => { setStructureChecked(!structureChecked) }}
                    label='structure.json'
                  />
                  <CheckboxInput
                    name='readme'
                    checked={ readmeChecked }
                    onChange={() => { setReadmeChecked(!readmeChecked) }}
                    label='readme.md'
                    disabled={readme === undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Error text={error} />
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Save...'
        onSubmit={handleSubmit}
        disabled={false}
        loading={loading}
      />
    </Modal>
  )
}

export default connectComponentToProps(
  ExportDatasetComponent,
  (state: any, ownProps: ExportDatasetProps) => {
    return {
      ...ownProps,
      modal: selectModal(state),
      username: selectDatasetUsername(state),
      name: selectDatasetName(state),
      path: selectDatasetPath(state),
      dataset: selectDataset(state)
    }
  },
  {
    onDismissed: dismissModal,
    onSubmit: () => {}
  }
)
