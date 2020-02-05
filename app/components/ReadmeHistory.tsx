import * as React from 'react'

interface ReadmeHistoryProps {
  peername: string
  name: string
  path: string
}

const ReadmeHistory: React.FunctionComponent<ReadmeHistoryProps> = (props) => {
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
    }, [])
    ref.current = setRef
    return [setRef]
  }

  const [ref] = refWithCallback()

  // React.useRef<HTMLDivElement>(null)
  // console.log(peername, name, path)
  // React.useEffect(() => {
  //   fetch(`http://localhost:2503/render/${peername}/${name}/at/${path}`)
  //     .then(async (res) => {
  //       setInnerHTML(await res.text())
  //     })
  //     .then((render) => {
  //       setInnerHTML(render)
  //       if (divElem && divElem.current) {
  //         divElem.current.innerHTML = render
  //         console.log('wooo')
  //       }
  //     })
  // }, [peername, name, path])

  // React.useEffect(() => {
  //   console.log('innerHTML')
  //   console.log(innerHTML)
  //   console.log(divElem.current)
  //   if (divElem && divElem.current) {
  //     divElem.current.innerHTML = innerHTML
  //   }
  // }, [innerHTML])
  // if (ref.current === null) {
  //   console.log('IN HERE')
  //   return null
  // }

  if (!hasReadme) {
    console.log('no readme')
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

export default ReadmeHistory
