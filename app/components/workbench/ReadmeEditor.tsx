import * as React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { useDebounce } from 'use-debounce'
import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'

import { ApiActionThunk } from '../../store/api'
import { datasetConvertStringToScriptBytes } from '../../utils/datasetConvertStringToScriptBytes'
import Dataset from '../../models/dataset'
import { refStringFromQriRef, QriRef } from '../../models/qriRef'
import { selectWorkingDatasetIsLoading, selectMutationsDataset, selectIsLinked, selectWorkingDatasetName, selectWorkingDatasetPeername } from '../../selections'
import Store from '../../models/store'
import { writeDataset } from '../../actions/workbench'

import SpinnerWithIcon from '../chrome/SpinnerWithIcon'

const DEBOUNCE_TIMER = 1000

export interface ReadmeEditorProps {
  qriRef: QriRef
  data?: string
  loading: boolean
  isLinked: boolean
  peername: string
  name: string
  write: (peername: string, name: string, dataset: any) => ApiActionThunk | void
}

export const ReadmeEditorComponent: React.FunctionComponent<ReadmeEditorProps> = (props) => {
  const {
    qriRef,
    data = '',
    write,
    loading,
    isLinked
  } = props

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

  /**
   * TODO (ramfox): this func is getting to the point where it probably should
   * live outside of this component, however, I'm not sure where it should live
   * and am leaning on the side of leaving it here until it is clearer whether
   * ephemeral fetches should be pulled out into their own file or if they
   * are okay living where they work
   */
  const getPreview = (plainText: string, preview: HTMLElement) => {
    if (isLinked) {
      fetch(`http://localhost:2503/render/${refStringFromQriRef(qriRef)}?fsi=true`)
        .then(async (res) => res.text())
        .then((render) => {
          preview.innerHTML = render
        })
    } else {
      const d: Dataset = datasetConvertStringToScriptBytes({ readme: plainText })
      fetch(`http://localhost:2503/render`, {
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

const mapStateToProps = (state: Store, ownProps: ReadmeEditorProps) => {
  return {
    ...ownProps,
    data: selectMutationsDataset(state).readme,
    loading: selectWorkingDatasetIsLoading(state),
    isLinked: selectIsLinked(state),
    peername: selectWorkingDatasetPeername(state),
    name: selectWorkingDatasetName(state)
  }
}

const mergeProps = (props: any, actions: any): ReadmeEditorProps => { //eslint-disable-line
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    write: writeDataset
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReadmeEditorComponent)
