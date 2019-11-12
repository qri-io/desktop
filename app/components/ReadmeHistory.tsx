import * as React from 'react'

interface ReadmeHistoryProps {
  peername: string
  name: string
  path: string
}

const ReadmeHistory: React.FunctionComponent<ReadmeHistoryProps> = (props) => {
  const { peername, name, path } = props
  const divElem = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    fetch(`http://localhost:2503/render/${peername}/${name}/at/${path}`)
      .then(async (res) => res.text())
      .then((render) => {
        if (divElem && divElem.current) {
          divElem.current.innerHTML = render
        }
      })
  }, [peername, name, path])
  return (
    <div
      // use "editor-preview" class to piggie-back off the simplemde styling
      className="editor-preview"
      ref={divElem}
    >loading...
    </div>
  )
}

export default ReadmeHistory
