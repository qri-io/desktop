import React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { useDebounce } from 'use-debounce'

import { ApiActionThunk } from '../../../store/api'
import { datasetConvertStringToScriptBytes } from '../../../utils/datasetConvertStringToScriptBytes'
import hasParseError from '../../../utils/hasParseError'
import Dataset from '../../../models/dataset'
import { refStringFromQriRef, QriRef, qriRefFromRoute } from '../../../models/qriRef'
import Store, { StatusInfo, RouteProps } from '../../../models/store'
import { openExternal } from './platformSpecific/Readme.TARGET_PLATFORM'

import { writeDataset } from '../../../actions/workbench'

import { BACKEND_URL } from '../../../backendUrl'

import { selectWorkingDatasetIsLoading, selectDatasetFromMutations, selectIsLinked, selectWorkingDatasetName, selectWorkingDatasetUsername, selectWorkingStatusInfo } from '../../../selections'

import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'
import ParseError from '../ParseError'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'

const DEBOUNCE_TIMER = 1000

export interface ReadmeEditorProps extends RouteProps {
  qriRef: QriRef
  data?: string
  loading: boolean
  isLinked: boolean
  peername: string
  name: string
  statusInfo: StatusInfo
  write: (peername: string, name: string, dataset: any) => ApiActionThunk | void
}

const passEventToOpenExternal = (e: MouseEvent) => { openExternal(e, e.target.href) }

export const ReadmeEditorComponent: React.FunctionComponent<ReadmeEditorProps> = (props) => {
  const {
    qriRef,
    data = '',
    write,
    loading,
    isLinked,
    statusInfo
  } = props

  if (hasParseError(statusInfo)) {
    return <ParseError component='readme' />
  }

  const username = qriRef.username || ''
  const name = qriRef.name || ''

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
      write(username, name, {
        readme: internalValue
      })
    }
  }, [debouncedValue])

  const handleChange = (value: string) => {
    setInternalValue(value)
  }

  const [ listenerAdded, setListenerAdded ] = React.useState(false)

  /**
   * TODO (ramfox): this func is getting to the point where it probably should
   * live outside of this component, however, I'm not sure where it should live
   * and am leaning on the side of leaving it here until it is clearer whether
   * ephemeral fetches should be pulled out into their own file or if they
   * are okay living where they work
   */
  const getPreview = (plainText: string, preview: HTMLElement) => {
    if (!listenerAdded) {
      preview.addEventListener('click', passEventToOpenExternal)
      setListenerAdded(true)
    }

    if (isLinked) {
      fetch(`${BACKEND_URL}/render/${refStringFromQriRef(qriRef)}?fsi=true`)
        .then(async (res) => res.text())
        .then((render) => {
          preview.innerHTML = render
        })
    } else {
      const d: Dataset = datasetConvertStringToScriptBytes({ readme: plainText })
      fetch(`${BACKEND_URL}/render`, {
        method: 'post',
        body: JSON.stringify(d),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(async (res) => res.text())
        .then((render) => {
          preview.innerHTML = render
        })
    }
    return 'Loading...'
  }

  if (loading) {
    return <SpinnerWithIcon loading />
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

export default connectComponentToProps(
  ReadmeEditorComponent,
  (state: Store, ownProps: ReadmeEditorProps) => {
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps),
      data: selectDatasetFromMutations(state).readme,
      loading: selectWorkingDatasetIsLoading(state),
      isLinked: selectIsLinked(state),
      peername: selectWorkingDatasetUsername(state),
      statusInfo: selectWorkingStatusInfo(state, 'readme'),
      name: selectWorkingDatasetName(state)
    }
  },
  {
    write: writeDataset
  }
)
