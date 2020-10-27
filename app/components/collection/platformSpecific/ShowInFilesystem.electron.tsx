import * as React from 'react'
import { shell } from 'electron'

import Button from '../../chrome/Button'

interface ShowInFilesystemProps {
  path: string
}

export const ShowInFilesystem: React.FunctionComponent<ShowInFilesystemProps> = ({ path }) =>
  <Button
    id='show-in-filesystem'
    text={`Show in ${process.platform === 'darwin' ? 'Finder' : 'Explorer'}`}
    color='primary'
    onClick={() => {
      shell.openItem(path)
    }}
  />
