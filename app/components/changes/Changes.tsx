import React from 'react'

import { fetchChanges } from '../../actions/api'

import { selectChanges, selectChangesError, selectChangesIsLoading, selectChangesRefsFromLocation } from '../../selections'

import { ApiActionThunk } from '../../store/api'

import { IChangeReport } from '../../models/changes'
import { QriRef } from '../../models/qriRef'
import Store, { RouteProps } from '../../models/store'

import { pathToCollection } from '../../paths'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { DISCORD_URL } from '../../constants'

import ChangeReport from './ChangeReport'
import Spinner from '../chrome/Spinner'
import ExternalLink from '../ExternalLink'
import Button from '../chrome/Button'

interface ChangesProps extends RouteProps {
  fetchChanges: (left: QriRef, right: QriRef) => ApiActionThunk
  loading: boolean
  data?: IChangeReport
  error: string
  refs: [QriRef, QriRef] | undefined
}

const ChangesComponent: React.FC<ChangesProps> = (props) => {
  if (!props.refs) {
    return <ChangesError message={'Unable to parse the dataset names'} />
  }
  const {
    refs,
    loading,
    data,
    error,
    fetchChanges
  } = props

  const left = refs[0]
  const right = refs[1]

  React.useEffect(() => {
    fetchChanges(left, right)
  }, [left.username, left.name, left.path, right.username, right.name, right.path])

  if (error) {
    return <ChangesError message={error} />
  }

  if (loading) {
    return <Spinner center />
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
      error: selectChangesError(state),
      refs: selectChangesRefsFromLocation(state)
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
        <Button color='primary' id='back-to-collection' link={pathToCollection()} text={'Return to the Collection'} />
      </div>
    </div>)
}
