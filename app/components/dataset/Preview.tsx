import React from 'react'

import { Dataset as IDataset, DatasetAction } from '../../models/dataset'
import { FetchOptions } from '../../store/api'
import { BACKEND_URL } from '../../constants'

import Dataset from './Dataset'
import PreviewNotFound from './PreviewNotFound'
import SpinnerWithIcon from '../chrome/SpinnerWithIcon'

interface PreviewProps {
  peername: string
  name: string
  path?: string

  actions?: DatasetAction[]
}

/**
 * Preview is a self-sufficiant component whose content is ephemeral, if you
 * give it a peername, name, and optional path, it will fetch the dataset
 * preview for you
 * TODO (ramfox): we can refactor the fetching and state into the Dataset
 * component itself, just wanted to iterate outside of the component first
 * This should probably have a different name, such as DatasetFetchAndPreview?
 */
const Preview: React.FunctionComponent<PreviewProps> = (props) => {
  const { peername, name, path = '', actions } = props

  const [data, setData] = React.useState<IDataset>()
  const [error, setError] = React.useState('')

  const fetchDataset = async (): Promise<void> => {
    const options: FetchOptions = {
      method: 'GET'
    }

    const url = path === '' ? `${BACKEND_URL}/preview/${peername}/${name}` : `${BACKEND_URL}/preview/${peername}/${name}/at/${path}`

    const r = await fetch(url, options)
    const res = await r.json()
    if (res.meta.code !== 200) {
      setError(res.meta.error)
      return
    }
    setData(res.data)
  }

  React.useEffect(() => {
    if (error !== '') setError('')
    fetchDataset()
  }, [peername, name, path])

  if (error !== '') {
    if (error.includes('not found')) {
      return <PreviewNotFound />
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 16,
          height: '100%',
          width: '100%'
        }}>
        <div style={{ width: 300 }}>
          There was an error loading dataset {peername}/{name}: {error}
        </div>
      </div>
    )
  }

  // TODO (ramfox): would love a better less jarring way to show loading
  // perhaps a DatasetLoading component that has all the sections rendered
  // with ala slack or linkedin or fb
  // basically, each segment has a `mock` version that we display when we are
  // `loading`, if `loading === false && !data`, however, we return null
  if (!data) return <SpinnerWithIcon loading/>

  return <Dataset data={data} actions={actions} />
}

export default Preview
