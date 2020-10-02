import * as React from 'react'

import Store, { RouteProps } from '../../../models/store'
import { refStringFromQriRef, QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { onClick as openExternal } from '../../platformSpecific/ExternalLink.TARGET_PLATFORM'

import { connectComponentToProps } from '../../../utils/connectComponentToProps'

export interface ReadmeProps extends RouteProps {
  qriRef: QriRef
}

const handleClick = (e: React.SyntheticEvent) => {
  openExternal(e, e.target.href)
}

export const ReadmeComponent: React.FunctionComponent<ReadmeProps> = (props) => {
  const { qriRef } = props
  const [hasReadme, setHasReadme] = React.useState(true)
  const refWithCallback = () => {
    const ref = React.useRef<HTMLDivElement>(null)
    const setRef = React.useCallback((el: HTMLDivElement) => {
      if (el !== null) {
        fetch(`http://localhost:2503/render/${refStringFromQriRef(qriRef)}`)
          .then(async (res) => {
            return res.text()
          })
          .then((render) => {
            if (!render) { setHasReadme(false) }
            el.innerHTML = render
          })
      }
    }, [refStringFromQriRef(qriRef)])
    ref.current = setRef
    return [setRef]
  }

  const [ref] = refWithCallback()

  if (!hasReadme) {
    return null
  }
  return (
    <div
      // use "editor-preview" class to piggie-back off the simplemde styling
      className="editor-preview"
      ref={ref}
      onClick={handleClick}
    >loading...
    </div>
  )
}

// TODO (b5) - this doesn't need to be a container at all
export default connectComponentToProps(
  ReadmeComponent,
  (state: Store, ownProps: ReadmeProps) => {
    // get data for the currently selected component
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps)
    }
  }
)
