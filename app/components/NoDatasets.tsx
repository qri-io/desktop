import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faPlus, faFile } from '@fortawesome/free-solid-svg-icons'

import { Modal, ModalType } from '../models/modals'
import WelcomeTemplate from './WelcomeTemplate'
import { Action } from 'redux'

interface NoDatasetsProps {
  setModal: (modal: Modal) => void
  setRoute: (route: string) => Action
}

const NoDatasets: React.FunctionComponent<NoDatasetsProps> = ({ setModal, setRoute }) =>
  <WelcomeTemplate
    title=''
    subtitle=''
    id='no-datasets-page'
    showLogo={false}
  >
    <div id='choose_dataset' className='no-datasets-options' onClick={async () => setRoute('collection')}>
      <h5><FontAwesomeIcon icon={faFile} />&nbsp;&nbsp;Explore a Dataset</h5>
      <p>Pick a dataset to explore from the Collections page.</p>
    </div>
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
