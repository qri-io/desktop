import React from 'react'
import { Prompt, RouteProps } from 'react-router-dom'

import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { QriRef } from '../../models/qriRef'
import { selectMutationsIsDirty, selectRecentEditRef } from '../../selections'

interface UncommittedChangesPromptProps extends RouteProps {
  recentEditRef: QriRef
  modified: boolean
}

export const UncommittedChangesPromptComponent: React.FC<UncommittedChangesPromptProps> = (props) => {
  const {
    recentEditRef,
    modified
  } = props

  const okToContinue = (newPath: string) => {
    return recentEditRef.location === '' ||
            (newPath.includes(recentEditRef.username) &&
            newPath.includes(recentEditRef.name))
  }

  const uncommittedChangesText = `You have uncommitted changes to dataset ${recentEditRef.username}/${recentEditRef.name} that will be lost if you navigate to a different dataset. 
  
Click 'cancel', navigate to dataset ${recentEditRef.username}/${recentEditRef.name}, and commit those changes to save.
 
Click 'ok' to continue and lose those changes.`

  return (
    <Prompt when={modified} message={(location) => {
      if (okToContinue(location.pathname)) return true
      return uncommittedChangesText
    }}/>
  )
}

export default connectComponentToPropsWithRouter(
  UncommittedChangesPromptComponent,
  (state: any, ownProps: UncommittedChangesPromptProps) => {
    return {
      ...ownProps,
      recentEditRef: selectRecentEditRef(state),
      modified: selectMutationsIsDirty(state)
    }
  }
)
