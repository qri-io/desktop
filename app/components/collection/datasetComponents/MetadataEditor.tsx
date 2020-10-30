import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'clone-deep'
import ReactTooltip from 'react-tooltip'

import { ApiActionThunk } from '../../../store/api'
import { Meta } from '../../../models/dataset'
import Store, { StatusInfo, RouteProps } from '../../../models/store'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'
import hasParseError from '../../../utils/hasParseError'

import { writeDataset } from '../../../actions/workbench'

import { selectDatasetFromMutations, selectWorkingDatasetIsLoading, selectWorkingDatasetUsername, selectWorkingDatasetName, selectWorkingStatusInfo } from '../../../selections'

import { QRI_IO_URL } from '../../../constants'

import ExternalLink from '../../ExternalLink'
import TextInput from '../../form/TextInput'
import TextAreaInput from '../../form/TextAreaInput'
import MultiTextInput from '../../form/MultiTextInput'
import DropdownInput from '../../form/DropdownInput'
import MetadataMultiInput from '../../form/MetadataMultiInput'
import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'
import ParseError from '../ParseError'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'

interface MetadataEditorProps extends RouteProps {
  qriRef: QriRef
  data?: Meta
  statusInfo: StatusInfo
  write: (peername: string, name: string, dataset: any) => ApiActionThunk | void
  loading: boolean
}

const renderValue = (value: string) => {
  switch (typeof value) {
    case 'string':
    case 'number':
      return <span>{value}</span>
    case 'object':
      return <span>{JSON.stringify(value)}</span>
    default:
      return <span>{JSON.stringify(value)}</span>
  }
}

const renderTable = (keys: string[], data: Meta) => {
  return (
    <div className='metadata-viewer-table-wrap'>
      <table className='metadata-viewer-table'>
        <tbody>
          {keys.map((key) => {
            const value = data[key]
            let cellContent = renderValue(value)

            return (
              <tr key={key} className='metadata-viewer-row'>
                <td className='metadata-viewer-key'>{key}</td>
                <td>{cellContent}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export const standardFields = [
  'accessURL',
  'accrualPeriodicity',
  'citations',
  'contributors',
  'description',
  'downloadURL',
  'homeURL',
  'identifier',
  'keywords',
  'language',
  'license',
  'readmeURL',
  'title',
  'theme',
  'version'
]

const MetadataEditorComponent: React.FunctionComponent<MetadataEditorProps> = (props: MetadataEditorProps) => {
  const {
    data = {},
    write,
    loading,
    statusInfo,
    qriRef
  } = props

  const username = qriRef.username || ''
  const name = qriRef.name || ''

  if (loading) {
    return <SpinnerWithIcon loading />
  }

  if (hasParseError(statusInfo)) {
    return <ParseError component='meta' />
  }

  React.useEffect(ReactTooltip.rebuild, [])

  const ignoreFields = ['qri', 'path']

  const handleWrite = (e: React.FocusEvent, target: string = '', value: any = undefined) => {
    const v = value || (e && e.target.value)
    const t = target || (e && e.target.getAttribute('name')) || ''
    const update: any = cloneDeep(data)

    if (v === '' || v === undefined || v === null || Object.keys(v).length === 0) {
      // if the value is empty and the original field is also undefined
      // then the blur action was called, but no change was made
      // so return early
      if (!update[t]) return
      delete update[t]
    } else {
      if (update[t] === v) return
      update[t] = v
    }

    write(username, name, {
      meta: update
    })
  }

  const licenseOptions = [
    {
      url: 'http://opendatacommons.org/licenses/by/1.0/',
      type: 'Open Data Commons Attribution License (ODC-By)'
    },
    {
      url: 'http://opendatacommons.org/licenses/odbl/1.0/',
      type: 'Open Data Commons Open Database License (ODbL)'
    },
    {
      url: 'https://creativecommons.org/licenses/by/4.0/',
      type: 'Creative Commons Attribution (CC BY)'
    },
    {
      url: 'https://creativecommons.org/licenses/by-sa/4.0/',
      type: 'Creative Commons Attribution-ShareAlike (CC BY-SA)'
    },
    {
      url: 'http://www.gnu.org/licenses/fdl-1.3.en.html',
      type: 'GNU Free Documentation License'
    }
  ]

  const extra = Object.keys(data).filter((key) => {
    return !(~standardFields.findIndex((sKey) => (key === sKey)) || ~ignoreFields.findIndex((iKey) => (key === iKey)))
  })

  return (
    <div className='content metadata-viewer-wrap'>
      <h4 className='metadata-viewer-title'>
        Standard Metadata
        &nbsp;
        <ExternalLink id='meta-docs' href={`${QRI_IO_URL}/docs/reference/dataset/#meta`}>
          <span
            data-tip={'Qri\'s common metadata fields.<br/>Click for more info.'}
            className='text-input-tooltip'
          >
            <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
          </span>
        </ExternalLink>
      </h4>
      <TextInput
        name='title'
        label='Title'
        labelTooltip='A single-line description of the dataset'
        type='text'
        value={data.title}
        placeHolder='Add a title'
        onBlur={handleWrite}
        maxLength={600}
      />
      <TextAreaInput
        name='description'
        label='Description'
        labelTooltip={'A detailed summary of the dataset\'s contents'}
        value={data.description}
        placeHolder='Add a description'
        onBlur={handleWrite}
        maxLength={600}
      />
      <MultiTextInput
        name='theme'
        label='Theme'
        labelTooltip='The main category or categories of the dataset'
        value={data.theme}
        placeHolder='Add a theme'
        onArrayChange={handleWrite}
      />
      <MultiTextInput
        name='keywords'
        label='Keywords'
        labelTooltip='Keywords or tags describing the dataset (more specific than theme)'
        value={data.keywords}
        placeHolder='Add a new keyword'
        onArrayChange={handleWrite}
      />
      {/*
        Dropdown Input uses react-select, which likes option that have 'label'
        and 'value' keys/ To keep it generic, we map our options to meet the
        requirements, and unmap them again on the way back out
        */}
      <DropdownInput
        name='license'
        label='License'
        labelTooltip='A legal document under which the resource is made available'
        value={
          data.license
            ? { label: data.license.type, value: data.license.url }
            : null
        }
        placeHolder='Add a license'
        options={licenseOptions.map((option) => ({
          value: option.url,
          label: option.type
        }))}
        onChange={(selectedOption) => {
          let newValue = null
          if (selectedOption) {
            const { label: type, value: url } = selectedOption
            newValue = {
              type,
              url
            }
          }
          handleWrite(null, 'license', newValue)
        }}
      />
      <MetadataMultiInput
        name='contributors'
        label='Contributors'
        labelTooltip='Users who have contributed to the dataset'
        value={data.contributors}
        placeHolder='Add a contributor'
        onWrite={handleWrite}
      />
      <MetadataMultiInput
        name='citations'
        label='Citations'
        labelTooltip='Works cited for the dataset'
        value={data.citations}
        placeHolder='Add a citation'
        onWrite={handleWrite}
      />
      <TextInput
        name='accessURL'
        label='Access URL'
        labelTooltip='A URL of the resource that gives access to a distribution of the dataset'
        type='url'
        value={data.accessURL}
        placeHolder='Add Access URL'
        onBlur={handleWrite}
        maxLength={600}
      />
      <TextInput
        name='downloadURL'
        label='Download URL'
        labelTooltip='A file that contains the distribution of the dataset in a given format'
        type='url'
        value={data.downloadURL}
        placeHolder='Add Download URL'
        onBlur={handleWrite}
        maxLength={600}
      />
      <TextInput
        name='homeURL'
        label='Home URL'
        labelTooltip='A URL of the dataset&apos;s homepage'
        type='url'
        value={data.homeURL}
        placeHolder='Add Home URL'
        onBlur={handleWrite}
        maxLength={600}
      />
      <TextInput
        name='readmeURL'
        label='Readme URL'
        labelTooltip='A url to a readme for the dataset'
        type='url'
        value={data.readmeURL}
        placeHolder='Add Readme URL'
        onBlur={handleWrite}
        maxLength={600}
      />
      <MultiTextInput
        name='language'
        label='Language'
        labelTooltip='Languages of the dataset.<br/>This refers to the natural language<br/> used for textual metadata of a dataset or<br/>the textual values of a dataset distribution'
        value={data.language}
        placeHolder='Add a language'
        onArrayChange={handleWrite}
      />
      <TextInput
        name='accrualPeriodicity'
        label='Accrual Periodicity'
        labelTooltip='The frequency at which dataset is published'
        type='text'
        value={data.accrualPeriodicity}
        placeHolder='Add Accrual Periodicity'
        onBlur={handleWrite}
        maxLength={600}
      />
      <TextInput
        name='version'
        label='Version'
        labelTooltip='The version of the dataset'
        type='text'
        value={data.version}
        placeHolder='Add version'
        onBlur={handleWrite}
        maxLength={600}
      />
      <TextInput
        name='identifier'
        label='Identifier'
        labelTooltip='An identifier for the dataset'
        type='text'
        value={data.identifier}
        placeHolder='Add identifier'
        onBlur={handleWrite}
        maxLength={600}
      />
      {(extra.length > 0) && <div>
        <h4 className='metadata-viewer-title'>
          Additional Metadata
          &nbsp;
          <span
            data-tip={'Custom metadata fields. To edit, modify this dataset\'s meta.json file'}
            className='text-input-tooltip'
          >
            <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
          </span>
        </h4>
        {renderTable(extra, data)}
      </div>}
    </div>
  )
}

export default connectComponentToProps(
  MetadataEditorComponent,
  (state: Store, ownProps: MetadataEditorProps) => {
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps),
      data: selectDatasetFromMutations(state).meta,
      loading: selectWorkingDatasetIsLoading(state),
      peername: selectWorkingDatasetUsername(state),
      statusInfo: selectWorkingStatusInfo(state, 'meta'),
      name: selectWorkingDatasetName(state)
    }
  },
  {
    write: writeDataset
  }
)
