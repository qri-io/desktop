import React from 'react'
import { Action } from 'redux'
import moment from 'moment'

import { QriRef } from '../../models/qriRef'
import { VersionInfo } from '../../models/store'
import { FetchOptions } from '../../store/api'
import { BACKEND_URL } from '../../constants'

import HistoryListItem from '../item/HistoryListItem'

export interface LogListProps {
  qriRef: QriRef
}

const LogList: React.FC<LogListProps> = ({ qriRef }) => {
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
    setData(res.data)
  }

  React.useEffect(() => {
    if (error !== '') setError('')
    fetchLogs()
  }, [qriRef.username, qriRef.name])

  return (
    <div
      id='history_list'
      className='sidebar-content'
    >
      {
        data.map((props, i) => {
          const { path, commitTime, commitTitle } = props
          return (
            <HistoryListItem
              key={path}
              id={`HEAD-${i + 1}`}
              first={i === 0}
              last={i === data.length - 1}
              path={path || ''}
              commitTitle={commitTitle || ''}
              timeMessage={moment(commitTime).fromNow()}
              selected={false}
              onClick={(s: string): Action => {
                alert(`you clicked a commit: ${s}`)
                return { type: '' }
              }}
            />
          )
        })
      }
    </div>
  )
}

export default LogList
