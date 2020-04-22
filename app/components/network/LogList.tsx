import React from 'react'
import { withRouter } from 'react-router-dom'

import { QriRef } from '../../models/qriRef'
import { VersionInfo, RouteProps } from '../../models/store'
import { FetchOptions } from '../../store/api'
import { BACKEND_URL } from '../../constants'
import { mapHistory } from '../../actions/mappingFuncs'

import LogListItem from '../item/LogListItem'
import { pathToNetworkDataset } from '../../paths'

export interface LogListProps extends RouteProps{
  qriRef: QriRef
}

const LogList: React.FunctionComponent<LogListProps> = ({ qriRef, history }) => {
  const [data, setData] = React.useState<VersionInfo[]>([])
  const [error, setError] = React.useState('')

  const fetchLogs = async (): Promise<void> => {
    const options: FetchOptions = {
      method: 'GET'
    }
    const r = await fetch(`${BACKEND_URL}/fetch/${qriRef.username}/${qriRef.name}`, options)
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
      id='history-list'
    >
      <label className='sidebar light'>Dataset History</label>
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
  )
}

export default withRouter(LogList)
