import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons'

import { Modal, ModalType } from '../models/modals'
import WelcomeTemplate from './WelcomeTemplate'

interface NoDatasetsProps {
  setModal: (modal: Modal) => void
}

const NoDatasets: React.FunctionComponent<NoDatasetsProps> = ({ setModal }) =>
  <WelcomeTemplate
    title='Let&apos;s get some datasets'
    subtitle='To get started, add an existing Qri dataset or create a new one from a data file'
    id='no-datasets-page'
    showLogo={false}
  >
    <div id='create_dataset' className='no-datasets-options' onClick={() => setModal({ type: ModalType.CreateDataset })}>
      <h5><FontAwesomeIcon icon={faDownload} />&nbsp;&nbsp;Create a Dataset</h5>
      <p>Choose a data file on your computer to create a new Qri dataset.</p>
    </div>
    <div id='add_dataset' className='no-datasets-options' onClick={() => setModal({ type: ModalType.AddDataset })}>
      <h5><FontAwesomeIcon icon={faPlus} />&nbsp;&nbsp;Add a Dataset</h5>
      <p>Copy an existing Qri dataset to your computer</p>
    </div>
  </WelcomeTemplate>

export default NoDatasets
