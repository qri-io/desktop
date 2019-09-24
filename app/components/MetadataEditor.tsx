import * as React from 'react'
import deepEqual from 'deep-equal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

// import ExternalLink from './ExternalLink'
import TextInput from './form/TextInput'
import TextAreaInput from './form/TextAreaInput'
import MultiTextInput from './form/MultiTextInput'
import DropdownInput from './form/DropdownInput'
import MultiStructuredInput from './form/MultiStructuredInput'
import { ApiAction } from '../store/api'

import { WorkingDataset } from '../models/store'
import { Meta } from '../models/dataset'

import SpinnerWithIcon from './chrome/SpinnerWithIcon'

interface MetadataEditorProps {
  workingDataset: WorkingDataset
  fsiWrite: (peername: string, name: string, dataset: any) => Promise<ApiAction>
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

const MetadataEditor: React.FunctionComponent<MetadataEditorProps> = (props: MetadataEditorProps) => {
  const { workingDataset, fsiWrite } = props

  const meta = workingDataset.components.meta.value
  const { peername, name } = workingDataset

  const [stateMeta, setStateMeta] = React.useState(meta)
  const [previousMeta, setPreviousMeta] = React.useState(meta)

  // when new meta comes from above, reset local state
  React.useEffect(() => {
    setStateMeta(meta)
    setPreviousMeta(meta)
  }, [meta])

  if (!meta) {
    return <SpinnerWithIcon loading={true} />
  }

  const ignoreFields = ['qri', 'path']

  const handleChange = (target: string, value: any) => {
    const update: any = {}
    update[target] = value

    setStateMeta({
      ...stateMeta,
      ...update
    })
  }

  const handleBlur = () => {
    // when an input blurs, check to see if anything in stateMeta is different
    // if it is, send the new meta object to the backend
    if (!deepEqual(stateMeta, previousMeta)) {
      setPreviousMeta(stateMeta)
      fsiWrite(peername, name, {
        meta: stateMeta
      })
    }
  }

  // like onChange(), but fires an fsiWrite and state update simultaneously
  const handleImmediateWrite = (target: string, value: any) => {
    const update: any = {}
    update[target] = value

    const newState = {
      ...stateMeta,
      ...update
    }

    fsiWrite(peername, name, {
      meta: newState
    })

    setStateMeta(newState)
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

  const extra = Object.keys(meta).filter((key) => {
    return !(~standardFields.findIndex((sKey) => (key === sKey)) || ~ignoreFields.findIndex((iKey) => (key === iKey)))
  })

  return (
    <div className='content metadata-viewer-wrap'>
      <h4 className='metadata-viewer-title'>
        Standard Metadata
        &nbsp;
        <span
          data-tip={'Qri\'s common metadata fields.  <br/> Read more at https://qri.io/docs/reference/dataset/#meta'}
          className='text-input-tooltip'
        >
          <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
        </span>
      </h4>
      <TextInput
        name='title'
        label='Title'
        labelTooltip='A name given to the dataset'
        type='text'
        value={stateMeta.title}
        placeHolder='Add a title'
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={600}
      />
      <TextAreaInput
        name='description'
        label='Description'
        labelTooltip='Free-text account of the record'
        value={stateMeta.description}
        placeHolder='Add a description'
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={600}
      />
      <MultiTextInput
        name='theme'
        label='Theme'
        labelTooltip='The main category of the dataset'
        value={stateMeta.theme}
        placeHolder='Add a theme'
        onArrayChange={handleImmediateWrite}
      />
      <MultiTextInput
        name='keywords'
        label='Keywords'
        labelTooltip='A keyword or tag describing the dataset'
        value={stateMeta.keywords}
        placeHolder='Add a new keyword'
        onArrayChange={handleImmediateWrite}
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
          stateMeta.license
            ? { label: stateMeta.license.type, value: stateMeta.license.url }
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
          handleImmediateWrite('license', newValue)
        }}
      />
      <MultiStructuredInput
        name='contributors'
        label='Contributors'
        labelTooltip='Users who have contributed to the dataset'
        value={stateMeta.contributors}
        placeHolder='Add a contributor'
        onChange={handleChange}
        onBlur={handleBlur}
        onArrayChange={handleImmediateWrite}
      />
      <MultiStructuredInput
        name='citations'
        label='Citations'
        labelTooltip='Works cited for the dataset'
        value={stateMeta.citations}
        placeHolder='Add a citation'
        onChange={handleChange}
        onBlur={handleBlur}
        onArrayChange={handleImmediateWrite}
      />
      <TextInput
        name='accessURL'
        label='Access URL'
        labelTooltip='A URL of the resource that gives access to a distribution of the dataset'
        type='url'
        value={stateMeta.accessURL}
        placeHolder='Add Access URL'
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={600}
      />
      <TextInput
        name='downloadURL'
        label='Download URL'
        labelTooltip='A file that contains the distribution of the dataset in a given format'
        type='url'
        value={stateMeta.downloadURL}
        placeHolder='Add Download URL'
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={600}
      />
      <TextInput
        name='homeURL'
        label='Home URL'
        labelTooltip='A URL of the dataset&apos;s homepage'
        type='url'
        value={stateMeta.homeURL}
        placeHolder='Add Home URL'
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={600}
      />
      <TextInput
        name='readmeURL'
        label='Readme URL'
        labelTooltip='A url to a readme for the dataset'
        type='url'
        value={stateMeta.readmeURL}
        placeHolder='Add Readme URL'
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={600}
      />
      <MultiTextInput
        name='language'
        label='Language'
        labelTooltip='A language of the item. This refers to the natural language used for textual metadata of a dataset or the textual values of a dataset distribution'
        value={stateMeta.language}
        placeHolder='Add a language'
        onArrayChange={handleImmediateWrite}
      />
      <TextInput
        name='accrualPeriodicity'
        label='Accrual Periodicity'
        labelTooltip='The frequency at which dataset is published.'
        type='text'
        value={stateMeta.accrualPeriodicity}
        placeHolder='Add Accrual Periodicity'
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={600}
      />
      <TextInput
        name='version'
        label='Version'
        labelTooltip='The version identifier of the dataset'
        type='text'
        value={stateMeta.version}
        placeHolder='Add version'
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={600}
      />
      <TextInput
        name='identifier'
        label='Identifier'
        labelTooltip='An identifier for the dataset'
        type='text'
        value={stateMeta.identifier}
        placeHolder='Add identifier'
        onChange={handleChange}
        onBlur={handleBlur}
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
        {renderTable(extra, meta)}
      </div>}
    </div>
  )
}

export default MetadataEditor
