import React from 'React'

import { P2PConnection, P2PConnectionEvent } from '../../models/network'
import LabelledStats from '../viz/LabelledStats'
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
      <LabelledStats light data={[
        ['qri peers', 8],
        ['conns.', 300],
        ['data transfer', '3.48Mb/s']
      ]} />
    </div>
  )
}

export default P2PConnectionStatus
