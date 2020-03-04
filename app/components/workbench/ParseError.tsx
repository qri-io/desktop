import * as React from 'react'
import Button from '../chrome/Button'
import { shell } from 'electron'

interface ParseErrorProps {
  component: string
  filename: string
  fsiPath: string
}

const ParseError: React.FunctionComponent<ParseErrorProps> = ({ component, filename, fsiPath }) => (
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

export default ParseError
