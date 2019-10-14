import * as React from 'react'
import Schema from './Schema'
import { Structure as IStructure } from '../models/dataset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import ExternalLink from './ExternalLink'
import TextInput from './form/TextInput'
import { ApiActionThunk } from '../store/api'

export interface StructureProps {
  peername: string
  name: string
  structure: IStructure
  history: boolean
  write: (peername: string, name: string, dataset: any) => ApiActionThunk
}

interface InputCheckboxProps {
  key: number
  history: boolean
  value: boolean
  label: string
  tooltip: string
  name: string
  onChange: (name: string, value: any) => void
}

const InputCheckbox: React.FunctionComponent<InputCheckboxProps> = ({ key, history, value, label, tooltip, onChange, name }) => {
  const [checked, setChecked] = React.useState(value)

  React.useEffect(() => {
    if (checked !== value) setChecked(value)
  }
  , [value])
  return (
    <div className='input-checkbox' key={key}>
      <div><input type="checkbox" id="headerRow" name={name} onChange={() => {
        const val = checked
        setChecked(!val)
        onChange(name, !val)
      }} disabled={history} checked={checked} />&nbsp;&nbsp;</div>
      <div>{label}&nbsp;</div>
      <span
        data-tip={tooltip}
        className='text-input-tooltip'
      >
        <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
      </span>
    </div>
  )
}

interface FormatConfigOption {
  label: string
  tooltip: string
  type: string
}

const csvFormatConfig: {[key: string]: string | boolean} = {
  headerRow: false,
  variadicFields: false,
  lazyQuotes: false
  // separator: ","
}

const jsonFormatConfig: {[key: string]: string | boolean} = {
  pretty: false
}

const xlsxFormatConfig: {[key: string]: string | boolean} = {
  sheetName: ''
}

const formatConfigOptions: { [key: string]: FormatConfigOption } = {
  headerRow: {
    label: 'This table contains a header row',
    tooltip: 'If the the first row of the table IS the row containing all the column names, check this input',
    type: 'boolean'
  },
  variadicFields: {
    label: 'This table has rows with different lengths',
    tooltip: 'If your table has rows that have different numbers of entries in each row, check this input',
    type: 'boolean'
  },
  lazyQuotes: {
    label: 'This table uses different quotes to indicate strings',
    tooltip: 'If your table sometime uses double quotes, sometimes uses single quotes, or sometimes doesn\'t use quotes at all, check this input',
    type: 'boolean'
  },
  // TODO (ramfox): the juice isn't worth the squeeze for this one quite yet
  // let's wait until someone yells at us about not being able to use a csv
  // with a separator other then ',' before we impliment
  // separator: {
  //   label: '',
  //   tooltip: '',
  //   type: 'rune'
  // },
  pretty: {
    label: 'Pretty-print JSON',
    tooltip: 'Check this box if you want your JSON to display formatted.',
    type: 'boolean'
  },
  sheetName: {
    label: 'Main sheet name:',
    tooltip: 'The name of the sheet that has the content that you want to be the focus of this dataset',
    type: 'string'
  }
}

const Structure: React.FunctionComponent<StructureProps> = ({ peername, name, structure, history, write }) => {
  // if we are displaying a structure from a moment in history
  // only show the config options that were set to true
  const renderInputCheckbox = (key: number, history: boolean, value: boolean, label: string, tooltip: string, onChange: (name: string, value: any) => void, name: string) => {
    if (history) {
      if (value) return <div key={key} className='config-item margin-bottom'>{label}</div>
      return undefined
    }
    return (
      <InputCheckbox
        name={name}
        key={key}
        history={history}
        value={value}
        label={label}
        tooltip={tooltip}
        onChange={onChange}
      />)
  }

  const renderTextInput = (key: number, history: boolean, value: string, label: string, tooltip: string, onChange: (name: string, value: any) => void, name: string) => {
    if (history) return <div className='config-item margin-bottom'>{label}: {value}</div>
    return (
      <TextInput
        key={key}
        label={label}
        labelTooltip={tooltip}
        onChange={onChange}
        value={value}
        name={name}
        type='text'
        maxLength={600}
      />
    )
  }

  const handleWrite = (option: string, value: any) => {
    write(peername, name, {
      structure: {
        ...structure,
        formatConfig: {
          ...structure.formatConfig,
          [option]: value
        }
      }
    })
  }

  var formatConfig: { [key: string]: string | boolean }
  const format = structure && structure.format
  if (history) formatConfig = structure.formatConfig
  else {
    switch (format) {
      case 'csv':
        formatConfig = {
          ...csvFormatConfig,
          ...structure.formatConfig
        }
        break
      case 'json':
        formatConfig = {
          ...jsonFormatConfig,
          ...structure.formatConfig
        }
        break
      case 'xlsx':
        formatConfig = {
          ...xlsxFormatConfig,
          ...structure.formatConfig
        }
        break
      default:
        formatConfig = {}
    }
  }
  return (
    <div className='structure content'>
      <div>
        <h4 className='config-title'>
          {format ? format.toUpperCase() + ' ' : ''}Configuration
        </h4>
        <div>
          { Object.keys(formatConfig).length === 0
            ? <div className='margin'>No configurations details</div>
            : Object.keys(formatConfigOptions).map((option: string, i) => {
              if (option in formatConfig) {
                switch (formatConfigOptions[option].type) {
                  case 'boolean':
                    return renderInputCheckbox(
                      i,
                      history,
                      !!formatConfig[option],
                      formatConfigOptions[option].label,
                      formatConfigOptions[option].tooltip,
                      handleWrite,
                      option
                    )
                  case 'string':
                    return renderTextInput(
                      i,
                      history,
                      formatConfig[option].toString(),
                      formatConfigOptions[option].label,
                      formatConfigOptions[option].tooltip,
                      handleWrite,
                      option
                    )
                }
              }
              return undefined
            })}
        </div>
      </div>
      <div>
        <h4 className='schema-title'>
          Schema
          &nbsp;
          <ExternalLink href='https://json-schema.org/'>
            <span
              data-tip={'JSON schema that describes the structure of the dataset. Click here to learn more about JSON schemas'}
              className='text-input-tooltip'
            >
              <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
            </span>
          </ExternalLink>
        </h4>
        <Schema schema={structure ? structure.schema : undefined} />
      </div>
    </div>
  )
}

export default Structure
