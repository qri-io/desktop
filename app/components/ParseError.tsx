import * as React from 'react'
import Button from './chrome/Button'
import { shell } from 'electron'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ParseErrorProps {
  component: string
  filename: string
  linkpath: string
}

const ParseError: React.FunctionComponent<ParseErrorProps> = ({ component, filename, linkpath }) => (
  <div className={'unlinked-dataset'}>
    <div className={'message-container'}>
      <div>
        <h4>There are parsing errors in your {component}</h4>
        <p>Fix the errors in your <strong>{filename}</strong> file to be able to view the file in Qri Desktop or to save a version of your dataset.</p>
        <Button text="Show in Finder" color="primary" onClick={() => { shell.openItem(linkpath) }} />
      </div>
    </div>
  </div>
)

export default ParseError
