import React, { useState } from 'react'

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

export const ExportDatasetComponent: React.FC<ExportDatasetProps> = (props: ExportDatasetProps) => {
  const { username, name, path, dataset, onDismissed, onSubmit } = props
  const { commit, structure, meta, readme } = dataset
  const enabledOtherComponents = ['structure'] // structure is always enabled
  if (meta) enabledOtherComponents.push('meta')
  if (readme) enabledOtherComponents.push('readme')

  const [dismissable, setDismissable] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [bodyFormat, setBodyFormat] = useState('csv')
  const [ config, setConfig ] = useState({
    body: true,
    // otherChecked has three states, 'true', 'false', 'indeterminate'
    // indeterminate state means the checkbox shows a '-' instead of checked or unchecked
    other: 'false',
    meta: false,
    structure: false,
    readme: false
  })

  const setConfigField = (field: string, value: boolean) => {
    const update = { ...config, [field]: value }

    if (field === 'other') {
      update.other = value ? 'true' : 'false'
      enabledOtherComponents.forEach((compName: string) => {
        update[compName] = value
      })
    } else {
      const enabledCount = enabledOtherComponents.length
      const checkedCount = [update.meta, update.structure, update.readme].reduce((acc, curr) => (curr ? acc + 1 : acc), 0)

      // set state of parent checkbox
      if (checkedCount === 0) {
        update.other = 'false'
      } else if (checkedCount === enabledCount) {
        update.other = 'true'
      } else {
        update.other = 'indeterminate'
      }
    }

    setConfig(update)
  }

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')
    if (!onSubmit) return

    alert('Exporting Files!')
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
                  checked={config.body}
                  onChange={() => { setConfigField('body', !config.body) }}
                  label='Body'
                  strong
                />
                <div className='options-column-content'>
                  <RadioInput
                    name='csv'
                    checked={bodyFormat === 'csv'}
                    onChange={() => { setBodyFormat('csv') }}
                    label='body.csv'
                    disabled={!config.body}
                  />
                  <RadioInput
                    name='should-remove-files'
                    checked={bodyFormat === 'json'}
                    onChange={() => { setBodyFormat('json') }}
                    label='body.json'
                    disabled={!config.body}
                  />
                </div>
              </div>
              <div className='options-column'>
                <CheckboxInput
                  name='other-components'
                  checked={config.other === 'true'}
                  onChange={() => { setConfigField('other', config.other === 'false') }}
                  indeterminate={config.other === 'indeterminate'}
                  label='Other Components'
                  strong
                />
                <div className='options-column-content'>
                  <CheckboxInput
                    name='meta'
                    checked={config.meta}
                    onChange={() => { setConfigField('meta', !config.meta) }}
                    label='meta.json'
                    disabled={meta === undefined}
                  />
                  <CheckboxInput
                    name='structure'
                    checked={config.structure}
                    onChange={() => { setConfigField('structure', !config.structure) }}
                    label='structure.json'
                  />
                  <CheckboxInput
                    name='readme'
                    checked={ config.readme }
                    onChange={() => { setConfigField('readme', !config.readme) }}
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
