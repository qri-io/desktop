import React from 'react'
import { withRouter } from 'react-router-dom'

import { QriRef } from '../../models/qriRef'
import { VersionInfo, RouteProps } from '../../models/store'
import { FetchOptions } from '../../store/api'
import { BACKEND_URL } from '../../constants'
import { mapHistory } from '../../actions/mappingFuncs'

import LogListItem from '../item/LogListItem'
import { pathToNetworkDataset } from '../../paths'

export interface NetworkLogListProps extends RouteProps{
  qriRef: QriRef
}

const NetworkLogList: React.FunctionComponent<NetworkLogListProps> = ({ qriRef, history }) => {
  const [data, setData] = React.useState<VersionInfo[]>([])
  const [error, setError] = React.useState('')

  const fetchLogs = async (): Promise<void> => {
    const options: FetchOptions = {
      method: 'GET'
    }
    const r = await fetch(`${BACKEND_URL}/history/${qriRef.username}/${qriRef.name}?pull=true`, options)
    const res = await r.json()
    if (res.meta.code !== 200) {
      setError(res.meta.error)
      return
    }
    setData(mapHistory(res.data))
  }

  React.useEffect(() => {
    if (error !== '') setError('')
    fetchLogs()
  }, [qriRef.username, qriRef.name])

  const handleOnClick = (item: VersionInfo) => {
    return () => {
      history.push(pathToNetworkDataset(item.username, item.name, item.path))
    }
  }

  return (
    <div
      id='network-history-list'
    >
      <label className='light'>Dataset History</label>
      <div className='list'>
        {
          data.map((item, i) => {
            const selected = qriRef.path ? qriRef.path === item.path : i === 0
            return (
              <LogListItem
                data={item}
                key={item.path}
                id={`HEAD-${i + 1}`}
                first={i === 0}
                last={i === data.length - 1}
                selected={selected}
                onClick={handleOnClick(item)}
                allowDisable={false}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default withRouter(NetworkLogList)
