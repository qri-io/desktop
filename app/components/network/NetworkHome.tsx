import React from 'react'

import { NetworkHomeData } from '../../models/network'
import { RouteProps } from '../../models/store'
import { Modal, ModalType } from '../../models/modals'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { setModal } from '../../actions/ui'

import Spinner from '../chrome/Spinner'
import { pathToNetworkDataset } from '../../paths'
import SearchBox from '../chrome/SearchBox'
import FeaturedDatasets from '../dataset/FeaturedDatasets'

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
    return <div className='spinner-container'><Spinner /></div>
  } else if (error) {
    return <div><h3>{JSON.stringify(error)}</h3></div>
  }

  const handleOnEnter = (e: React.KeyboardEvent) => {
    setModal({ q: e.target.value, type: ModalType.Search })
  }

  const { featured, recent } = data

  const onClick = (username: string, name: string) => {
    history.push(pathToNetworkDataset(username, name))
  }

  return (
    <>
      <SearchBox onEnter={handleOnEnter} id='search-box' />
      <div className='network_home'>
        {featured && featured.length && <div>
          <h4>Featured Datasets</h4>
          <FeaturedDatasets datasets={featured} onClick={onClick}/>
        </div>
        }
        {recent && recent.length && <div>
          <h4>Recent Datasets</h4>
          <FeaturedDatasets datasets={recent} onClick={onClick}/>
        </div>}
      </div>
    </>
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

  const r = await fetch(`https://registry.qri.cloud/dataset_summary/splash`, options)
  const res = await r.json()
  if (res.meta.code !== 200) {
    var err = { code: res.meta.code, message: res.meta.error }
    throw err // eslint-disable-line
  }

  return res.data as NetworkHomeData
}
