import React from 'react'
import { remote } from 'electron'

import TextInput from '../form/TextInput'
import ButtonInput from '../form/ButtonInput'
import Icon from '../chrome/Icon'
import ExternalLink from '../ExternalLink'

export interface CompareParams {
  left: string
  right: string
}

export interface CompareSidebarProps {
  data: CompareParams
  onChange: (p: CompareParams) => void
}

const CompareSidebar: React.FC<CompareSidebarProps> = ({ data, onChange }) => {
  const pathPicker = (side: string) => {
    const window = remote.getCurrentWindow()
    const filePaths: string[] | undefined = remote.dialog.showOpenDialogSync(window, {
      title: 'Choose a CSV file',
      buttonLabel: 'Load',
      filters: [
        { name: 'Structured Data', extensions: ['csv'] }
      ],
      properties: ['openFile']
    })

    if (!filePaths) {
      return
    }

    switch (side) {
      case 'left':
        onChange({ left: filePaths[0], right: data.right })
        break
      case 'right':
        onChange({ right: filePaths[0], left: data.left })
        break
    }
  }

  const handleFilePickerDialog = (side: string, showFunc: (side: string) => void) => {
    new Promise(resolve => {
      resolve()
    }).then(() => showFunc(side))
  }

  const handleSwap = () => {
    onChange({ right: data.left, left: data.right })
  }

  return (
    <div className='compare-sidebar sidebar'>
      <div className='sidebar-header sidebar-padded-container'>
        <p className='pane-title'>Compare</p>
      </div>
      <div className='sidebar-padded-container'>
        <div className='picker'>
          <div className='indicator'>
            <Icon icon='minus' size='md' color='red' />
          </div>
          <TextInput
            name='left'
            type=''
            onChange={(v: string) => { }}
            value={data.left}
            maxLength={600}
          />
          <div className='margin-left'>
            <ButtonInput id='chooseLeft' onClick={() => { handleFilePickerDialog('left', pathPicker) }}>
              <Icon icon='file' size='md' color='light' />
            </ButtonInput>
          </div>
        </div>
        <div className='picker swap'>
          <ButtonInput disabled={!(data.left && data.right)} onClick={handleSwap}>
            <Icon icon='sort' size='md' color='light' />
          </ButtonInput>
        </div>
        <div className='picker'>
          <div className='indicator'>
            <Icon icon='plus' size='md' color='green' />
          </div>
          <TextInput
            name='right'
            type=''
            value={data.right}
            onChange={(v: string) => { }}
            maxLength={600}
          />
          <div className='margin-left'>
            <ButtonInput id='chooseRight' onClick={() => { handleFilePickerDialog('right', pathPicker) }}>
              <Icon icon='file' size='md' color='light' />
            </ButtonInput>
          </div>
        </div>
      </div>
      <div className='sidebar-padded-container note'>
        <p>Compare view is under active development. Comparing is limited to CSV files under 10Mb. If you have any feeback, please <ExternalLink id='file-compare-issue' href='https://github.com/qri-io/desktop/issues/new'>file an issue</ExternalLink>.</p>
      </div>
    </div>
  )
}

export default CompareSidebar
