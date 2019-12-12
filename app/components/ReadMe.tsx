import * as React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { useDebounce } from 'use-debounce'

import { WorkingDataset } from '../models/store'
import { ApiActionThunk } from '../store/api'

const DEBOUNCE_TIMER = 1000

export interface ReadmeProps {
  peername: string
  name: string
  value: string
  preview: string
  history: boolean
  workingDataset: WorkingDataset
  write: (peername: string, name: string, dataset: any) => ApiActionThunk
}

const Readme: React.FunctionComponent<ReadmeProps> = (props) => {
  const { value, peername, name, write } = props
  const [internalValue, setInternalValue] = React.useState(value)
  const [debouncedValue] = useDebounce(internalValue, DEBOUNCE_TIMER)

  React.useEffect(() => {
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  })

  const onFocus = () => {
    setInternalValue(value)
  }

  React.useEffect(() => {
    if (debouncedValue !== value) {
      write(peername, name, {
        readme: {
          scriptBytes: btoa(unescape(encodeURIComponent(internalValue)))
        }
      })
    }
  }, [debouncedValue])

  const handleChange = (value: string) => {
    setInternalValue(value)
  }

  const getPreview = (plainText: string, preview: HTMLElement) => {
    fetch(`http://localhost:2503/render/${peername}/${name}?fsi=true`)
      .then(async (res) => res.text())
      .then((render) => {
        preview.innerHTML = render
      })
    return 'Loading...'
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
