import React, { useState } from 'react'
import classNames from 'classnames'

import { connectComponentToProps } from '../utils/connectComponentToProps'
import { Store, RemoteEvents, RemoteEvent } from '../models/store'
import ProgressBar from './chrome/ProgressBar'
import Icon from './chrome/Icon'

interface TranfersProps {
  transfers: RemoteEvents
}

export const TransfersComponent: React.FC<TranfersProps> = ({ transfers }) => {
  const [open, setOpen] = useState(false)
  const keys = Object.keys(transfers)
  const count = keys.length

  const isPulling = keys.findIndex((key) => (transfers[key].type === 'pull-version')) >= 0
  const isPushing = keys.findIndex((key) => (transfers[key].type === 'push-version')) >= 0

  let headerMessage = ''
  let complete = 0
  if (count === 1) {
    headerMessage = title(transfers[keys[0]])
    complete = pctComplete(transfers[keys[0]])
  } else if (count > 1) {
    headerMessage = `${count} transfers`
    complete = keys.reduce((acc, key) => (acc + pctComplete(transfers[key])), 0) / keys.length
  }

  return (
    <div id='transfers' className={classNames('transfers', {
      visible: (count > 0)
    })}>
      <header onClick={() => { setOpen(!open) }}>
        {count > 0 &&
          <>
            <span className='header-message'>{headerMessage}</span>
            <ProgressBar percent={complete * 100} />
          </>
        }
        <div className='transfer-indicators'>
          <Icon icon='down-arrow' size='sm' className={classNames({ active: isPulling })} />
          <Icon icon='up-arrow' size='sm' className={classNames({ active: isPushing })} />
        </div>
      </header>
      {open && <div className='transfers list popover'>
        <header>
          <strong>Transfers</strong>
        </header>
        <div>
          {keys.map((key) => (
            <div className='transfer item' key={key}>
              <Icon color='medium' icon={(transfers[key].type === 'pull-version') ? 'down-arrow' : 'up-arrow'} size='md' />
              <div className='details'>
                <span className='title'>{`${transfers[key].ref.username}/${transfers[key].ref.name}`}</span>
                <ProgressBar percent={pctComplete(transfers[key]) * 100} color='#0061A6' />
              </div>
            </div>
          ))}
          {count === 0 && <div className='no-transfers'>
            <p>No Transfers</p>
          </div>}
        </div>
      </div>}
    </div>
  )
}

function title (evt: RemoteEvent): string {
  let title = `${evt.ref.username}/${evt.ref.name}`
  switch (evt.type) {
    case 'push-version':
      title = 'pushing ' + title
      break
    case 'pull-version':
      title = 'pulling ' + title
      break
  }

  return title
}

function pctComplete (evt: RemoteEvent): number {
  if (!evt.progress) {
    return 0
  }
  return evt.progress.reduce((acc, v) => (acc + v), 0) / (evt.progress.length * 100)
}

export default connectComponentToProps(
  TransfersComponent,
  (state: Store, ownProps: TranfersProps) => {
    return {
      ...ownProps,
      transfers: state.transfers
    }
  },
  {}
)
