import * as React from 'react'
import { selectMyDatasets, selectMyDatasetsPageInfo, selectSessionUsername } from '../selections'
import { fetchMyDatasets, fetchSession } from './api'
import { connectComponentToProps } from '../utils/connectComponentToProps'
import { VersionInfo, PageInfo } from '../models/store'
import { ApiActionThunk } from '../store/api'
import Spinner from '../components/chrome/Spinner'
import Layout from './Layout'
import DatasetItem from '../components/item/DatasetItem'
import { BACKEND_URL } from '../constants'
import Icon from '../components/chrome/Icon'
import Button from '../components/chrome/Button'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'

const logo = require('../assets/qri-blob-logo-small.png') // eslint-disable-line

const WebappComponent: React.FunctionComponent = () => {
  return <Layout
    id='webapp-container'
    headerContent={<HeaderContent />}
    mainContent={<MainContent />}
  />
}

export default WebappComponent

interface HeaderContentProps {
  remoteName: string
  fetchSession: () => ApiActionThunk
}

const HeaderContentComponent: React.FC<HeaderContentProps> = (props: HeaderContentProps) => {
  const { fetchSession, remoteName } = props

  React.useEffect(() => {
    fetchSession()
  }, [])

  return <div style={{ display: 'flex', alignItems: 'center' }}>
    <a href="https://qri.io">
      <img className='webapp-logo' id='webapp-logo' src={logo} />
    </a>
    <h1
      style={{
        display: 'inlineBlock',
        marginTop: 10,
        marginLeft: 20
      }}>
        Datasets on {remoteName === '' ? 'Remote' : remoteName}:
    </h1>
  </div>
}

const HeaderContent = connectComponentToProps(
  HeaderContentComponent,
  (state: any, ownProps: HeaderContentProps) => {
    return {
      remoteName: selectSessionUsername(state)
    }
  },
  {
    fetchSession
  }
)

interface MainContentProps {
  fetchDatasets: (page?: number, pageSize?: number) => ApiActionThunk
  datasets: VersionInfo[]
  pageInfo: PageInfo
}
const MainContentComponent: React.FC<MainContentProps> = (props: MainContentProps) => {
  const { fetchDatasets, pageInfo, datasets } = props
  const { isFetching, error, page, fetchedAll } = pageInfo

  React.useEffect(() => {
    if (page === -1) {
      fetchDatasets(1, 20)
    }
  }, [])

  var content: React.ReactElement | React.ReactElement[]

  if (!isFetching && (!datasets || datasets.length === 0)) {
    content = <div>no datasets</div>
  }
  if (error !== '') {
    content = <div>{error}</div>
  }

  if (datasets && datasets.length) {
    content = datasets.map((vi: VersionInfo, i) => {
      return (<div key={i} className='webapp-dataset-list-item'>
        <DatasetItem
          data={vi}
          id={`recent-${i}`}
          onClick={() => {}}
          fullWidth={false}
          noLink
        />
        <a href={`${BACKEND_URL}/get/${vi.username}/${vi.name}?format=zip`} download={`${vi.username}_${vi.name}.zip`} ><Icon
          icon="download"
          color="primary"
        />
        </a>
      </div>)
    })
  }

  console.log(page)
  return <div className='webapp-home'>
    <div style={{ overflow: 'auto', height: '100%' }}>
      {content}
      {isFetching && <Spinner />}
      {!isFetching && !fetchedAll && error === '' &&
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
          <Button onClick={(e) => fetchDatasets(page + 1, 20)} text={"load more..."}/>
        </div>
      }
    </div>
  </div>
}

const MainContent = connectComponentToProps(
  MainContentComponent,
  (state: any, ownProps: MainContentProps) => {
    return {
      datasets: selectMyDatasets(state),
      pageInfo: selectMyDatasetsPageInfo(state)
    }
  },
  {
    fetchDatasets: fetchMyDatasets
  }
)
