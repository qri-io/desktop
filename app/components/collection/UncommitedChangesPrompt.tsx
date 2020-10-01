import React from 'react'
import { Prompt, RouteProps } from 'react-router-dom'
import { Action } from 'redux'

import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { QriRef } from '../../models/qriRef'
import { resetMutationsDataset, resetMutationsStatus } from '../../actions/mutations'
import { selectMutationsIsDirty, selectRecentEditRef } from '../../selections'

interface UncommitedChangesPromptProps extends RouteProps {
  recentEditRef: QriRef
  modified: boolean
  resetMutationsDataset: () => Action
  resetMutationsStatus: () => Action
}

export const UncommitedChangesPromptComponent: React.FC<UncommitedChangesPromptProps> = (props) => {
  const {
    recentEditRef,
    modified,
    resetMutationsDataset,
    resetMutationsStatus
  } = props

  React.useEffect(() => {
    return () => {
      resetMutationsDataset()
      resetMutationsStatus()
    }
  }, [])

  const okToContinue = (newPath: string) => {
    return recentEditRef.location === '' ||
            (newPath.includes(recentEditRef.username) &&
            newPath.includes(recentEditRef.name))
  }

  const uncommitedChangesText = `You have uncommited changes! Click 'cancel' and commit these changes before you navigate away or you will lose your work.`

  return (
    <Prompt when={modified} message={(location) => {
      if (okToContinue(location.pathname)) return true
      return uncommitedChangesText
    }}/>
  )
}

export default connectComponentToPropsWithRouter(
  UncommitedChangesPromptComponent,
  (state: any, ownProps: UncommitedChangesPromptProps) => {
    return {
      ...ownProps,
      recentEditRef: selectRecentEditRef(state),
      modified: selectMutationsIsDirty(state)
    }
  },
  {
    resetMutationsDataset,
    resetMutationsStatus
  }
)
