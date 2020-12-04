import React from 'react'

import { fetchChanges } from '../../actions/api'

import { selectChanges, selectChangesError, selectChangesIsLoading } from '../../selections'

import { ApiActionThunk } from '../../store/api'

import { IChangeReport } from '../../models/changes'
import { QriRef } from '../../models/qriRef'
import Store, { RouteProps } from '../../models/store'

import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { DISCORD_URL } from '../../constants'

import ChangeReport from './ChangeReport'
import ExternalLink from '../ExternalLink'
import SpinnerWithIcon from '../chrome/SpinnerWithIcon'

interface ChangesProps extends RouteProps {
  fetchChanges: (left: QriRef, right: QriRef) => ApiActionThunk
  loading: boolean
  data?: IChangeReport
  error: string

  // left and right should always be passed in by the parent component
  left?: QriRef
  right: QriRef
}

export const LoadingDatasetChanges: React.FC = () =>
  <SpinnerWithIcon title='calculating changes...' loading spinner />

const ChangesComponent: React.FC<ChangesProps> = (props) => {
  const {
    left,
    right,
    loading,
    data,
    error,
    fetchChanges
  } = props

  React.useEffect(() => {
    if (left) fetchChanges(left, right)
  }, [left, right.username, right.name, right.path])

  if (loading) {
    return <LoadingDatasetChanges />
  }

  if (error) {
    return <ChangesError message={error} />
  }

  if (!left || !right) {
    return <ChangesError message={'Unable to load the requested datasets'} />
  }

  if (!data) {
    return <ChangesError message={'Error: no change report data found.'} />
  }

  return <div style={{ overflowY: 'auto', height: '100%' }}><ChangeReport data={data} leftRef={left} rightRef={right} /></div>
}

export default connectComponentToPropsWithRouter(
  ChangesComponent,
  (state: Store, ownProps: ChangesProps) => {
    return {
      ...ownProps,
      loading: selectChangesIsLoading(state),
      data: selectChanges(state),
      error: selectChangesError(state)
    }
  }, {
    fetchChanges
  }
)

interface ChangesErrorProps {
  message: string
}

const ChangesError: React.FC<ChangesErrorProps> = ({ message }) => {
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ fontWeight: 500, marginBottom: 20 }}>{message}</div>
        <div style={{ marginBottom: 20 }}>Reach out to us on <ExternalLink href={DISCORD_URL} >Discord</ExternalLink> for help.</div>
      </div>
    </div>)
}
