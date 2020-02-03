import * as React from 'react'

const NoDatasetSelected: React.FunctionComponent = () => (
  <div className={'unlinked-dataset'}>
    <div className={'message-container'}>
      <div>
        <h4>Choose a dataset to explore</h4>
        <p>Use {process.platform === 'darwin' ? 'Command + T' : 'Ctrl + T'} to toggle the dataset list open and closed</p>
        <a href='#' onClick={(e) => {
          e.preventDefault()
        }}>Or click here to open the dataset list</a>
      </div>
    </div>
  </div>
)

export default NoDatasetSelected
