import * as React from 'react'
import { connect } from 'react-redux'

import Store from '../../models/store'
import { selectHistoryDatasetRef } from '../../selections'

export interface ReadmeProps {
  datasetRef: string
}

export const ReadmeComponent: React.FunctionComponent<ReadmeProps> = (props) => {
  const { datasetRef } = props
  const [hasReadme, setHasReadme] = React.useState(true)
  const refWithCallback = () => {
    const ref = React.useRef<HTMLDivElement>(null)
    const setRef = React.useCallback((el: HTMLDivElement) => {
      if (el !== null) {
        fetch(`http://localhost:2503/render/${datasetRef}`)
          .then(async (res) => {
            return res.text()
          })
          .then((render) => {
            if (!render) { setHasReadme(false) }
            el.innerHTML = render
          })
      }
    }, [datasetRef])
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
    >loading...
    </div>
  )
}

const mapStateToProps = (state: Store) => {
  // get data for the currently selected component
  return {
    datasetRef: selectHistoryDatasetRef(state)
  }
}

// TODO (b5) - this doesn't need to be a container at all
export default connect(mapStateToProps)(ReadmeComponent)
