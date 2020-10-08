import React, { useState } from 'react'
import classNames from 'classnames'

import { dismissModal } from '../../actions/ui'
import { ExportDatasetModal } from '../../../app/models/modals'
import { selectModal } from '../../selections'
import { connectComponentToProps } from '../../utils/connectComponentToProps'
import exportDatasetVersion from '../../actions/platformSpecific/export.TARGET_PLATFORM'

import Modal from './Modal'
import Error from './Error'
import Buttons from './Buttons'
import CommitDetails from '../CommitDetails'
import RadioInput from '../form/RadioInput'

interface ExportDatasetProps {
  modal: ExportDatasetModal
  onDismissed: () => void
}

export const ExportDatasetComponent: React.FC<ExportDatasetProps> = (props: ExportDatasetProps) => {
  const { onDismissed } = props
  const { version } = props.modal

  const [dismissable, setDismissable] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [exportMode, setExportMode] = useState('csv')

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')
    exportDatasetVersion(version, exportMode)
    onDismissed()
  }

  const modes = [
    {
      mode: 'csv',
      title: 'CSV file',
      description: 'just the dataset body as a comma-separated values file'
    },
    {
      mode: 'zip',
      title: 'Zip Archive',
      description: 'all dataset components in a zip archive of CSV & JSON files'
    }
    // {
    //   mode: 'json',
    //   title: 'JSON',
    //   description: 'all dataset data in a single JSON document'
    // }
  ]

  return (
    <Modal
      id='export-dataset'
      className='export-dataset-modal'
      title='Export'
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div className='content'>
          <div className='export-dataset-info'>
            <div className='dialog-text-small'>
              <code style={{ marginBottom: '15px' }}>{version.username}/{version.name}</code><br/>
              <CommitDetails {...version} />
            </div>
          </div>
          <div className='mode-picker'>
            <h4>Format</h4>
            {modes.map(({ mode, title, description }) => (
              <div
                key={mode}
                className={classNames('mode-item', { selected: (exportMode === mode) })}
                onClick={() => { setExportMode(mode) }}
              >
                <RadioInput name={mode} checked={exportMode === mode} onChange={(m) => setExportMode(m) } />
                <div className='text'>
                  <h5 className='title'>{title}</h5>
                  <span className='description'>{description}</span>
                </div>
              </div>
            ))}
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
      modal: selectModal(state)
    }
  },
  {
    onDismissed: dismissModal
  }
)
