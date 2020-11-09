import React, { useState } from 'react'
import classNames from 'classnames'

import { dismissModal } from '../../actions/ui'
import { ExportDatasetModal } from '../../../app/models/modals'
import { selectModal } from '../../selections'
import { connectComponentToProps } from '../../utils/connectComponentToProps'
import { exportDatasetVersion } from '../../actions/export'

import Modal from './Modal'
import Error from './Error'
import CommitDetails from '../CommitDetails'
import RadioInput from '../form/RadioInput'
import { refStringFromQriRef } from '../../models/qriRef'
import { BACKEND_URL } from '../../backendUrl'
import { VersionInfo } from '../../models/store'
import { ExportSubmitButton } from './ExportSubmitButton'
import Button from '../chrome/Button'
import moment from 'moment'

interface ExportDatasetProps {
  modal: ExportDatasetModal
  onDismissed: () => void
}

export function exportLink (vi: VersionInfo, config: string): string {
  let exportUrl = `${BACKEND_URL}/get/${refStringFromQriRef(vi)}?format=zip`
  if (config === 'csv') {
    exportUrl = `${BACKEND_URL}/get/${refStringFromQriRef(vi)}/body.csv`
  }
  return exportUrl
}

export function downloadName (vi: VersionInfo, config: string): string {
  return `${vi.username}-${vi.name}-${moment(vi.commitTime).format('YYYY-MM-DDThh-mm-ss-a')}.${config}`
}

export const ExportDatasetComponent: React.FC<ExportDatasetProps> = (props: ExportDatasetProps) => {
  const { onDismissed } = props
  const { version } = props.modal

  const [dismissable, setDismissable] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [exportMode, setExportMode] = useState('csv')

  const handleSubmit = () => {
    console.log('submit clicked')
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
            <h4 className='section-title'>Format</h4>
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
      <div className='buttons'>
        <Button id='cancel' text='cancel' onClick={onDismissed} color='muted' />
        <ExportSubmitButton
          id='submit'
          color='dark'
          text={'Save...'}
          onClick={handleSubmit}
          loading={loading}
          disabled={false}
          download={exportLink(version, exportMode)}
          downloadName={downloadName(version, exportMode)}
        />
      </div>
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
