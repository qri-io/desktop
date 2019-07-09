import * as React from 'react'
import Spinner from './chrome/Spinner'

const blobs = require('../assets/qri-blob-logo-large.png')
const version: string = require('../../version').default

export const AppLoading: React.FunctionComponent<any> = () => 
<div style={{ 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
}}>
    <div style={{ 
      width: 300, 
      height: 300, 
      textAlign: 'center',
    }}>
      <img style={{marginBottom: 20}} className='app-loading-blob' src={blobs} height={200} width={200}/>
      <h4>Starting Qri Desktop</h4>
      <h6>version {version}</h6>
      <div style={{marginTop:20}}><Spinner /></div>
    </div>
  </div>

export default AppLoading