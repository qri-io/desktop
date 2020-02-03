import React from 'react'

import { P2PConnection, P2PConnectionEvent } from '../../models/network'
import LabeledStats from '../item/LabeledStats'
import Switch from '../form/Switch'

export interface P2PConnectionStatusProps {
  data: P2PConnection

  onChange: P2PConnectionEvent
}

const P2PConnectionStatus: React.FunctionComponent<P2PConnectionStatusProps> = ({ data, onChange }) => {
  const onChangeConnection = (e: React.SyntheticEvent) => {
    onChange(Object.assign({}, data, { enabled: !data.enabled }), e)
  }

  return (
    <div className='p2p_connection_status'>
      <header>
        <label>P2P</label>
        <Switch value={data.enabled} onChange={onChangeConnection} />
      </header>
      <LabeledStats color='light' data={[
        { label: 'qri peers', value: 8 },
        { label: 'conns.', value: 300 },
        { label: 'data transfer', value: '3.48Mb/s' }
      ]} />
    </div>
  )
}

export default P2PConnectionStatus
