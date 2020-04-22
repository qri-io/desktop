import * as React from 'react'
import { shell } from 'electron'

import { SelectedComponent } from '../../models/store'

import { connectComponentToProps } from '../../utils/connectComponentToProps'

import { selectWorkingStatusInfo, selectFsiPath } from '../../selections'

import Button from '../chrome/Button'

interface ParseErrorProps {
  // from parent component
  component: string
  // from connect
  filename?: string
  fsiPath?: string
}

const ParseErrorComponent: React.FunctionComponent<ParseErrorProps> = ({ component, filename, fsiPath = '' }) => (
  <div className='unlinked-dataset'>
    <div className='message-container'>
      <div>
        <h4>There are parsing errors in your {component}</h4>
        <p>Fix the errors in your <strong>{filename}</strong> file to be able to view it in Qri Desktop.</p>
        <Button id='show_errors_in_finder' text="Show in Finder" color="primary" onClick={() => { shell.openItem(fsiPath) }} />
      </div>
    </div>
  </div>
)

export default connectComponentToProps(
  ParseErrorComponent,
  (state: any, ownProps: ParseErrorProps) => {
    const statusInfo = selectWorkingStatusInfo(state, ownProps.component as SelectedComponent)
    return {
      ...ownProps,
      filename: statusInfo.filepath,
      fsiPath: selectFsiPath(state)
    }
  }
)
