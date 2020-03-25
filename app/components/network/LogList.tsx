import React from 'react'

import { QriRef, refStringFromQriRef } from '../../models/qriRef'
import { VersionInfo } from '../../models/store'
import { FetchOptions } from '../../store/api'
import { BACKEND_URL } from '../../constants'
import { mapHistory } from '../../actions/mappingFuncs'

import HistoryListItem from '../item/HistoryListItem'
import { RouteComponentProps, withRouter } from 'react-router-dom'

export interface LogListProps extends RouteComponentProps{
  qriRef: QriRef
}

const LogList: React.FC<LogListProps> = ({ qriRef, history }) => {
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
      history.push(`/network/${refStringFromQriRef({ location: '', username: item.username, name: item.name, path: item.path })}`)
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
            <HistoryListItem
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
