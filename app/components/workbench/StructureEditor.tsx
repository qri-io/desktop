import * as React from 'react'
import { connect } from 'react-redux'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { bindActionCreators, Dispatch } from 'redux'

import Dataset, { Structure as IStructure, Schema as ISchema } from '../../models/dataset'
import { ApiActionThunk } from '../../store/api'
import fileSize, { abbreviateNumber } from '../../utils/fileSize'
import { selectMutationsDataset, selectWorkingDatasetIsLoading, selectWorkingDatasetPeername, selectWorkingDatasetName } from '../../selections'
import Store from '../../models/store'
import { writeDataset } from '../../actions/workbench'
import { QriRef } from '../../models/qriRef'

import SpinnerWithIcon from '../chrome/SpinnerWithIcon'
import LabeledStats from '../item/LabeledStats'
import Schema from '../structure/Schema'
import ExternalLink from '../ExternalLink'
import FormatConfigEditor from '../structure/FormatConfigEditor'

export interface StructureEditorProps {
  qriRef: QriRef
  data: IStructure
  showConfig?: boolean
  loading: boolean
  write?: (peername: string, name: string, dataset: Dataset) => ApiActionThunk | void
}

export const StructureEditorComponent: React.FunctionComponent<StructureEditorProps> = (props) => {
  const { data, write, loading, qriRef } = props

  if (loading) {
    return <SpinnerWithIcon loading />
  }

  const username = qriRef.username || ''
  const name = qriRef.name || ''

  const format = data.format || 'csv'
  const handleWriteFormat = (option: string, value: any) => {
    if (!write) return
    // TODO (ramfox): sending over format since a user can replace the body with a body of a different
    // format. Let's pass in whatever the current format is, so that we have unity between
    // what the desktop is seeing and the backend. This can be removed when we have the fsi
    // backend codepaths settled
    write(username, name, { structure: {
      ...data,
      format,
      formatConfig: {
        ...data.formatConfig,
        [option]: value
      }
    } })
  }

  const handleOnChange = (schema: ISchema) => {
    if (write) write(username, name, { structure: { ...data, schema } })
  }

  const stats = [
    { 'label': 'format', 'value': data.format ? data.format.toUpperCase() : 'unknown' },
    { 'label': 'body size', 'value': data.length ? fileSize(data.length) : '—' },
    { 'label': 'entries', 'value': abbreviateNumber(data.entries) || '—' },
    { 'label': 'errors', 'value': data.errCount ? abbreviateNumber(data.errCount) : '—' },
    { 'label': 'depth', 'value': data.depth || '—' }
  ]

  return (
    <div className='structure'>
      <div className='stats'><LabeledStats data={stats} size='lg' /></div>
      <FormatConfigEditor
        structure={data}
        format={format}
        write={handleWriteFormat}
      />
      <div>
        <h4 className='schema-title'>
          Schema
          &nbsp;
          <ExternalLink id='json-schema' href='https://json-schema.org/'>
            <span
              data-tip={'JSON schema that describes the structure of the dataset. Click here to learn more about JSON schemas'}
              className='text-input-tooltip'
            >
              <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
            </span>
          </ExternalLink>
        </h4>
      </div>
      <Schema
        data={data ? data.schema : undefined}
        onChange={handleOnChange}
        editable
      />
    </div>
  )
}

const mapStateToProps = (state: Store, ownProps: StructureEditorProps) => {
  return {
    ...ownProps,
    data: selectMutationsDataset(state).structure,
    loading: selectWorkingDatasetIsLoading(state),
    peername: selectWorkingDatasetPeername(state),
    name: selectWorkingDatasetName(state)

  }
}

const mergeProps = (props: any, actions: any): StructureEditorProps => {
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    write: writeDataset
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(StructureEditorComponent)
