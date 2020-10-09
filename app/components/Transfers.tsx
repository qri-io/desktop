import React, { useState } from 'react'
import classNames from 'classnames'

import { connectComponentToPropsWithRouter } from '../utils/connectComponentToProps'
import { Store, RemoteEvents, RemoteEvent } from '../models/store'
import { pathToDataset } from '../paths'
import ProgressBar from './chrome/ProgressBar'
import Icon from './chrome/Icon'

interface TranfersProps {
  transfers: RemoteEvents
}

export const TransfersComponent: React.FC<TranfersProps> = ({ transfers, history }) => {
  const [open, setOpen] = useState(false)
  const keys = Object.keys(transfers)
  const count = keys.length
  const activeCount = keys.filter((key) => !transfers[key].complete).length

  const isPulling = keys.findIndex((key) => (transfers[key].type === 'pull-version' && !transfers[key].complete)) >= 0
  const isPushing = keys.findIndex((key) => (transfers[key].type === 'push-version' && !transfers[key].complete)) >= 0

  let headerMessage = ''
  let complete = 0
  if (activeCount === 1) {
    headerMessage = title(transfers[keys[0]])
    complete = pctComplete(transfers[keys[0]])
  } else if (activeCount > 1) {
    headerMessage = `${activeCount} transfers`
    complete = keys.reduce((acc, key) => (acc + pctComplete(transfers[key])), 0) / keys.length
  }

  return (
    <div id='transfers' className={classNames('transfers', {
      visible: (count > 0)
    })}>
      <header onClick={() => { setOpen(!open) }}>
        {activeCount > 0 &&
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
            <div
              key={key}
              className={classNames('transfer', 'item', { complete: transfers[key].complete })}
              onClick={() => {
                const tf = transfers[key]
                if (tf.complete) {
                  history.push(pathToDataset(tf.ref.username, tf.ref.name, tf.ref.path))
                }
              }}
            >
              <Icon color='medium' icon={(transfers[key].type === 'pull-version') ? 'down-arrow' : 'up-arrow'} size='md' />
              <div className='details'>
                <div className='title'>{`${transfers[key].ref.username}/${transfers[key].ref.name}`}</div>
                {transfers[key].complete
                  ? <div className='complete'>complete</div>
                  : <ProgressBar percent={pctComplete(transfers[key]) * 100} color='#0061A6' />
                }
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

export default connectComponentToPropsWithRouter(
  TransfersComponent,
  (state: Store, ownProps: TranfersProps) => {
    return {
      ...ownProps,
      transfers: state.transfers
    }
  },
  {}
)
