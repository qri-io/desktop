import * as React from 'react'
import Schema from './Schema'
import { Structure as IStructure } from '../models/dataset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import ExternalLink from './ExternalLink'
import { ApiActionThunk } from '../store/api'
import FormatConfigHistory from './FormatConfigHistory'
import FormatConfigFSI from './FormatConfigFSI'

export interface StructureProps {
  peername: string
  name: string
  structure: IStructure
  history: boolean
  fsiBodyFormat: string
  write: (peername: string, name: string, dataset: any) => ApiActionThunk
}

export interface FormatConfigOption {
  label: string
  tooltip: string
  type: string
}

export const formatConfigOptions: { [key: string]: FormatConfigOption } = {
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

const Structure: React.FunctionComponent<StructureProps> = ({ peername, name, structure, history, write, fsiBodyFormat }) => {
  const format = history ? structure.format : fsiBodyFormat
  const handleWrite = (option: string, value: any) => {
    // TODO (ramfox): sending over format since a user can replace the body with a body of a different
    // format. Let's pass in whatever the current format is, so that we have unity between
    // what the desktop is seeing and the backend. This can be removed when we have the fsi
    // backend codepaths settled
    write(peername, name, {
      structure: {
        ...structure,
        format,
        formatConfig: {
          ...structure.formatConfig,
          [option]: value
        }
      }
    })
  }
  return (
    <div className='structure content'>
      { history
        ? <FormatConfigHistory structure={structure} />
        : <FormatConfigFSI
          structure={structure}
          format={format}
          write={handleWrite}
        />
      }
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
