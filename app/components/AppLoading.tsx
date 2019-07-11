import * as React from 'react'
import Spinner from './chrome/Spinner'

export const logo = require('../assets/qri-blob-logo-large.png') // eslint-disable-line
const version: string = require('../../version').default

export const AppLoading: React.FunctionComponent<any> = () =>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 100,
    backgroundColor: '#fff'
  }}>
    <div style={{
      width: 300,
      height: 300,
      textAlign: 'center'
    }}>
      <img style={{ marginBottom: 20 }} className='app-loading-blob' src={logo} height={150} width={150}/>
      <h4>Starting Qri Desktop</h4>
      <h6>version {version}</h6>
      <div style={{ marginTop: 20 }}><Spinner /></div>
    </div>
  </div>

export default AppLoading
