import * as React from 'react'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Structure as IStructure } from '../../models/dataset'

import { formatConfigOptions } from '../Structure'
import TextInput from '../form/TextInput'

export interface FormatConfigFSIProps {
  structure: IStructure
  format: string
  write: (option: string, value: any) => any
}

interface InputCheckboxProps {
  value: boolean
  label: string
  tooltip: string
  name: string
  onChange: (name: string, value: any) => void
}

const InputCheckbox: React.FunctionComponent<InputCheckboxProps> = ({ value, label, tooltip, onChange, name }) => {
  const [checked, setChecked] = React.useState(value)

  React.useEffect(() => {
    if (checked !== value) setChecked(value)
  }
  , [value])
  return (
    <div className='input-checkbox' >
      <div><input type="checkbox" id={name} name={name} onChange={() => {
        const val = checked
        setChecked(!val)
        onChange(name, !val)
      }} checked={checked} />&nbsp;&nbsp;</div>
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

const FormatConfigFSI: React.FunctionComponent<FormatConfigFSIProps> = ({ structure, write, format }) => {
  const handleOnChange = (e: React.ChangeEvent) => {
    write(e.target.names, e.target.value)
  }
  // Get the format config from structure that is coming from fsi
  // if there is no format config, set the formatConfig to {}
  var formatConfig: {[key: string]: string | boolean} = {}
  formatConfig = structure && structure.formatConfig ? structure.formatConfig : formatConfig
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
  }
  return (
  // for each option in formatConfig, display an input that allows the user to change the configuration
  // the options should exist whether or not a structure exists or a formatConfig exists
  // if a file does not exist, calling `write` will create a structure file with the given configuration
    <div>
      <h4 className='config-title'>
        {format ? format.toUpperCase() + ' ' : ''}Configuration
      </h4>
      <div>
        {
          Object.keys(formatConfig).map((option: string, i) => {
            switch (formatConfigOptions[option].type) {
              case 'boolean':
                return <InputCheckbox
                  name={option}
                  key={i}
                  value={!!formatConfig[option]}
                  label={formatConfigOptions[option].label}
                  tooltip={formatConfigOptions[option].tooltip}
                  onChange={write}
                />
              case 'string':
                return <TextInput
                  key={i}
                  label={formatConfigOptions[option].label}
                  labelTooltip={formatConfigOptions[option].tooltip}
                  onChange={handleOnChange}
                  value={formatConfig[option].toString()}
                  name={option}
                  type='text'
                  maxLength={600}
                />
              default:
                return undefined
            }
          })}
      </div>
    </div>
  )
}

export default FormatConfigFSI
