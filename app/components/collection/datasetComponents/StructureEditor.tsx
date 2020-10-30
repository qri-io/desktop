import React from 'react'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Dataset, { Structure as IStructure, Schema as ISchema } from '../../../models/dataset'
import { ApiActionThunk } from '../../../store/api'
import fileSize, { abbreviateNumber } from '../../../utils/fileSize'
import { selectDatasetFromMutations, selectWorkingDatasetIsLoading, selectWorkingDatasetUsername, selectWorkingDatasetName, selectWorkingStatusInfo } from '../../../selections'
import Store, { StatusInfo, RouteProps } from '../../../models/store'
import { writeDataset } from '../../../actions/workbench'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'
import hasParseError from '../../../utils/hasParseError'

import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'
import LabeledStats from '../../item/LabeledStats'
import Schema from '../../structure/Schema'
import ExternalLink from '../../ExternalLink'
import FormatConfigEditor from '../../structure/FormatConfigEditor'
import ParseError from '../ParseError'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'

export interface StructureEditorProps extends RouteProps {
  qriRef: QriRef
  data?: IStructure
  showConfig?: boolean
  loading: boolean
  statusInfo: StatusInfo
  write?: (peername: string, name: string, dataset: Dataset) => ApiActionThunk | void
}

export const StructureEditorComponent: React.FunctionComponent<StructureEditorProps> = (props) => {
  const { data, write, loading, qriRef, statusInfo } = props

  if (loading) {
    return <SpinnerWithIcon loading />
  }

  if (hasParseError(statusInfo)) {
    return <ParseError component='structure' />
  }

  if (!data) { return null }

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

  let schema
  if (data && data.schema) {
    schema = data.schema
  }

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
        data={schema}
        onChange={handleOnChange}
        editable
      />
    </div>
  )
}

export default connectComponentToProps(
  StructureEditorComponent,
  (state: Store, ownProps: StructureEditorProps) => {
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps),
      data: selectDatasetFromMutations(state).structure,
      loading: selectWorkingDatasetIsLoading(state),
      peername: selectWorkingDatasetUsername(state),
      statusInfo: selectWorkingStatusInfo(state, 'structure'),
      name: selectWorkingDatasetName(state)
    }
  },
  {
    write: writeDataset
  }
)
