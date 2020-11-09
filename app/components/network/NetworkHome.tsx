import React from 'react'

import { BACKEND_URL } from '../../backendUrl'
import { NetworkHomeData } from '../../models/network'
import { VersionInfo, RouteProps } from '../../models/store'
import { Modal, ModalType } from '../../models/modals'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { setModal } from '../../actions/ui'

import Spinner from '../chrome/Spinner'
import DatasetItem from '../item/DatasetItem'
import { pathToNetworkDataset } from '../../paths'
import SearchBox from '../chrome/SearchBox'

const initialDataState: NetworkHomeData = {
  featured: [],
  recent: []
}

interface NetworkHomeProps extends RouteProps {
  setModal: (modal: Modal) => void
}

// NetworkHome accepts no props
export const NetworkHome: React.FunctionComponent<NetworkHomeProps> = ({ history, setModal }) => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(initialDataState)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    homeFeed()
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(error => {
        console.log('error:', error)
        setLoading(false)
        setError(error)
      })
  }, [false])

  if (loading) {
    return <Spinner />
  } else if (error) {
    return <div><h3>{JSON.stringify(error)}</h3></div>
  }

  const handleOnEnter = (e: React.KeyboardEvent) => {
    setModal({ q: e.target.value, type: ModalType.Search })
  }

  const { featured, recent } = data

  return (
    <div className='network_home'>
      <SearchBox onEnter={handleOnEnter} id='search-box' />
      {featured && featured.length && <div>
        <h4>Featured Datasets</h4>
        {featured.map((vi: VersionInfo, i) => <div key={i} className='featured-datasets-item'>
          <DatasetItem onClick={(username: string, name: string) => {
            history.push(pathToNetworkDataset(username, name))
          }} data={vi} id={`featured-${i}`}/>
        </div>)}
      </div>}
      {recent && recent.length && <div>
        <h4>Recent Datasets</h4>
        {recent.map((vi: VersionInfo, i) => <div key={i} className='recent-datasets-item'>
          <DatasetItem onClick={(username: string, name: string) => {
            history.push(pathToNetworkDataset(username, name))
          }} data={vi} id={`recent-${i}`} />
        </div>)}
      </div>}
    </div>
  )
}

export default connectComponentToPropsWithRouter(
  NetworkHome,
  {},
  {
    setModal
  }
)

// TODO (b5) - bring this back in the near future for fetching home feed
async function homeFeed (): Promise<NetworkHomeData> {
  const options: FetchOptions = {
    method: 'GET'
  }

  const r = await fetch(`${BACKEND_URL}/feeds`, options)
  const res = await r.json()
  if (res.meta.code !== 200) {
    var err = { code: res.meta.code, message: res.meta.error }
    throw err // eslint-disable-line
  }

  return res.data as NetworkHomeData
}
