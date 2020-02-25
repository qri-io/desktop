import * as React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { useDebounce } from 'use-debounce'

import { ApiActionThunk } from '../store/api'

import SpinnerWithIcon from './chrome/SpinnerWithIcon'

const DEBOUNCE_TIMER = 1000

export interface ReadmeProps {
  username: string
  name: string
  data?: string
  loading: boolean
  write: (dataset: any) => ApiActionThunk | void
}

const Readme: React.FunctionComponent<ReadmeProps> = (props) => {
  const { data = '', username, name, write, loading } = props

  const [internalValue, setInternalValue] = React.useState(data)
  const [debouncedValue] = useDebounce(internalValue, DEBOUNCE_TIMER)

  React.useEffect(() => {
    setInternalValue(data)
  }, [data])

  React.useEffect(() => {
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  })

  const onFocus = () => {
    setInternalValue(data)
  }

  React.useEffect(() => {
    if (debouncedValue !== data) {
      write({
        readme: internalValue
      })
    }
  }, [debouncedValue])

  const handleChange = (value: string) => {
    setInternalValue(value)
  }

  const getPreview = (plainText: string, preview: HTMLElement) => {
    fetch(`http://localhost:2503/render/${username}/${name}?fsi=true`)
      .then(async (res) => res.text())
      .then((render) => {
        preview.innerHTML = render
      })
    return 'Loading...'
  }

  if (loading) {
    return <SpinnerWithIcon loading={true} />
  }

  return (
    <SimpleMDE
      id="readme-editor"
      value={internalValue}
      onChange={handleChange}
      options={{
        spellChecker: false,
        toolbar: [
          'preview',
          'bold',
          'italic',
          'strikethrough',
          'heading',
          '|',
          'code',
          'quote',
          '|',
          'link',
          'image',
          'table',
          '|',
          'unordered-list',
          'ordered-list'
        ],
        status: false,
        placeholder: 'Start writing your readme here',
        previewRender: getPreview
      }}
    />
  )
}

export default Readme
