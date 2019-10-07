import * as React from 'react'
import Schema from './Schema'
import { Structure as IStructure } from '../models/dataset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import ExternalLink from './ExternalLink'

interface StructureProps {
  structure: IStructure
  history: boolean
}

interface InputCheckboxProps {
  key: number
  history: boolean
  value: boolean
  label: string
  tooltip: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputCheckbox: React.FunctionComponent<InputCheckboxProps> = ({ key, history, value, label, tooltip, onChange }) => {
  return (
    <div className='input-checkbox' key={key}>
      <div><input type="checkbox" id="headerRow" onChange={onChange} disabled={history} checked={value} />&nbsp;&nbsp;</div>
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

const formatConfigOptions = {
  headerRow: {
    label: 'The body file contains a header row',
    tooltip: 'If the the first row of the dataset body and the header row are the same, this input should be checked.'
  },
  pretty: {
    label: 'Pretty-print JSON',
    tooltip: 'Check this box if you want your JSON to display formatted.'
  }
}

const Structure: React.FunctionComponent<StructureProps> = ({ structure, history }) => {
  if (!structure) return <div></div>
  const { schema, formatConfig } = structure
  return (
    <div className='structure content'>
      <div>
        <h4 className='config-title'>
          Configuration
        </h4>
        <div>
          { !formatConfig ? <div className='margin'>No configurations details</div>
            : Object.keys(formatConfigOptions).map((option: string, i) => {
              if (formatConfig[option] === undefined) return undefined
              return (
                <InputCheckbox
                  key={i}
                  history={history}
                  value={formatConfig[option]}
                  label={formatConfigOptions[option].label}
                  tooltip={formatConfigOptions[option].tooltip}
                  onChange={(e) => console.log(e, formatConfigOptions[option].name)}
                />)
            })}
        </div>
      </div>
      <div>
        <h4 className='schema-title'>
          JSON Schema
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
        <Schema schema={schema} />
      </div>
    </div>
  )
}

export default Structure
