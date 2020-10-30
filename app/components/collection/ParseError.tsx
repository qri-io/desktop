import React from 'react'
import path from 'path'

import { SelectedComponent } from '../../models/store'

import { connectComponentToProps } from '../../utils/connectComponentToProps'

import { selectWorkingStatusInfo } from '../../selections'

import { ShowInFilesystem } from './ShowInFilesystem'

interface ParseErrorProps {
  // from parent component
  component: string
  // from connect
  filename?: string
}

const ParseErrorComponent: React.FunctionComponent<ParseErrorProps> = ({ component, filename }) => {
  return (
    <div className='unlinked-dataset margin'>
      <div className='message-container'>
        <div>
          <h4>There are parsing errors in your {component}</h4>
          <p>Fix the errors in your <strong>{filename}</strong> file to be able to view it in Qri Desktop.</p>
          <ShowInFilesystem path={filename && path.dirname(filename)} />
        </div>
      </div>
    </div>
  )
}

export default connectComponentToProps(
  ParseErrorComponent,
  (state: any, ownProps: ParseErrorProps) => {
    const statusInfo = selectWorkingStatusInfo(state, ownProps.component as SelectedComponent)
    return {
      ...ownProps,
      filename: statusInfo.filepath
    }
  }
)
