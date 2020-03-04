import * as React from 'react'
import { connect } from 'react-redux'

import Store from '../../models/store'

export interface ReadmeHistoryProps {
  peername: string
  name: string
  path: string
}

export const ReadmeHistoryComponent: React.FunctionComponent<ReadmeHistoryProps> = (props) => {
  const { peername, name, path } = props
  const [hasReadme, setHasReadme] = React.useState(true)
  const refWithCallback = () => {
    const ref = React.useRef<HTMLDivElement>(null)
    const setRef = React.useCallback((el: HTMLDivElement) => {
      if (el !== null) {
        fetch(`http://localhost:2503/render/${peername}/${name}/at/${path}`)
          .then(async (res) => {
            return res.text()
          })
          .then((render) => {
            if (!render) { setHasReadme(false) }
            el.innerHTML = render
          })
      }
    }, [peername, name, path])
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
  const { selections } = state

  const { peername, name, commit } = selections

  // get data for the currently selected component
  return {
    peername,
    path: commit,
    name
  }
}

// TODO (b5) - this doesn't need to be a container at all
export default connect(mapStateToProps)(ReadmeHistoryComponent)
