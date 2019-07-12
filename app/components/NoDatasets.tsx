import * as React from 'react'
import { logo } from './AppLoading'
// import { PopupType, Popup } from '../models/popup'

// interface NoDatasetsProps {
//   setPopup: (popup: Popup) => any
//   onClick: React.Dispatch<React.SetStateAction<boolean>>
// }

// const NoDatasets: React.FunctionComponent<NoDatasetsProps> = ({ setPopup }) => {
//   return <div style={{ background: 'white', height: '100%', width: '100%', zIndex: 97 }}>
//     <div>
//       No datasets!
//     </div>
//     <a onClick={setPopup({ type: PopupType.AddDataset, initialURL: '' })}>Add Dataset!</a>
//     <a onClick={setPopup({ type: PopupType.InitializeDataset, dirPath: '' })}>InitializeDataset Dataset!</a>
//   </div>
// }

const NoDatasets: React.FunctionComponent<any> = () =>
  <div id='no-datasets-page' className='welcome-page'>
    <div className='welcome-center'>
      <img className='welcome-graphic' src={logo} />
      <div className='welcome-title'>
        <h2>Let&apos;s get some datasets</h2>
        <h6>Create a dataset in Qri or add a dataset that is already on Qri</h6>
      </div>
      <div className='no-datasets-content'>
        <div className='options' >
          <h5>Create a Dataset</h5>
          <h6>Want to create a dataset from scratch, or already have a data file you want to start versioning?<br/>Start here!</h6>
        </div>
        <div className='options' >
          <h5>Add a Dataset</h5>
          <h6>Have the link to a dataset that is already on Qri and want to add it to your Qri repository?<br/>Start here!</h6>
        </div>
      </div>
    </div>
  </div>

export default NoDatasets
