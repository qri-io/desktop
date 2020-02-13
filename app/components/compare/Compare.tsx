import * as React from 'react'

import { BACKEND_URL } from '../../constants'

import Spinner from '../chrome/Spinner'
import CompareSidebar, { CompareParams } from './CompareSidebar'
import Layout from '../Layout'
import TableDiff from './TableDiff'

export interface CompareProps {
  compact?: boolean
}

const initialCompareParams: CompareParams = {
  left: '',
  right: ''
}

const Compare: React.FunctionComponent<CompareProps> = (props: CompareProps) => {
  const [loading, setLoading] = React.useState(false)
  const [params, setParams] = React.useState(initialCompareParams)
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (!params.left || !params.right) {
      return
    }
    setLoading(true)
    setError('')

    diff(params.left, params.right)
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setError(error)
      })
  }, [params])

  const mainContent = () => {
    if (loading) {
      return <Spinner />
    } else if (error) {
      return <div><h3>{JSON.stringify(error)}</h3></div>
    }

    return (
      <div className='compare-content'>
        <TableDiff data={data} />
      </div>
    )
  }

  return (
    <Layout
      id='compare-container'
      sidebarContent={<CompareSidebar data={params} onChange={setParams} />}
      sidebarWidth={360}
      // onSidebarResize={(width) => { setSidebarWidth('collection', width) }}
      mainContent={mainContent()}
    />
  )
}

export default Compare

async function diff (left: string, right: string): Promise<any[]> {
  const options: FetchOptions = {
    method: 'GET'
  }

  const r = await fetch(`${BACKEND_URL}/diff?left_path=${left}&right_path=${right}`, options)
  const res = await r.json()
  if (res.meta.code !== 200) {
    var err = { code: res.meta.code, message: res.meta.error }
    throw err // eslint-disable-line
  }

  return res.data as any[]
}
