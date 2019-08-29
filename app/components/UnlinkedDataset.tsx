import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlink } from '@fortawesome/free-solid-svg-icons'

const UnlinkedDataset: React.FunctionComponent = () => (
  <div className={'unlinked-dataset'}>
    <div className={'message-container'}>
      <div>
        <h4>This is an Unlinked Dataset</h4>
        <p>To use the status tab, link the dataset to your filesystem.</p>
        <a href='#'>Link this Dataset</a>
      </div>
      <FontAwesomeIcon icon={faUnlink} color='#777'/>
    </div>
  </div>
)

export default UnlinkedDataset
