import React from 'react'
import { remote } from 'electron'
import fs from 'fs'
import { Action } from 'redux'
import classNames from 'classnames'
import { connect } from 'react-redux'

import Store, { ToastType } from '../../models/store'

import { openToast } from '../../actions/ui'

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
  openToast: (type: ToastType, name: string, message: string) => Action
}

export const CompareSidebarComponent: React.FunctionComponent<CompareSidebarProps> = ({ data, onChange, openToast }) => {
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

    let filepath = filePaths[0]

    const stats = fs.statSync(filepath)

    // if over 10 mb reject
    if (stats.size > (1024 * 1000 * 10)) {
      filepath = ''
      openToast("error", "file size", "file must be under 10MB")
    }

    switch (side) {
      case 'left':
        onChange({ left: filepath, right: data.right })
        break
      case 'right':
        onChange({ right: filepath, left: data.left })
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
      <div className='sidebar-header sidebar-padded-container compare-sidebar-header'>
        <p className='pane-title'>Compare</p>
        <div className={classNames('reset', { disabled: !(data.left || data.right) })} onClick={() => { onChange({ right: '', left: '' }) }}>reset</div>
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

const mapStateToProps = (state: Store, ownProps: CompareSidebarProps) => {
  return ownProps
}

export default connect(mapStateToProps, {
  openToast
})(CompareSidebarComponent)
