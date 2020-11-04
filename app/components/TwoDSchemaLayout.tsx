import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn } from '@fortawesome/free-solid-svg-icons'

import KeyValueTable from './KeyValueTable'
import { schemaColumns } from '../utils/schemaColumns'
import { Schema } from '../models/dataset'

interface RowProps {
  column: ColumnProperties
}

const buildOtherKeywordsTable = (column: any) => {
  const filterKeys = ['title', 'type', 'description']
  const hasOtherKeys = Object.keys(column).filter(d => !filterKeys.includes(d)).length > 0
  return hasOtherKeys ? <KeyValueTable data={column} filterKeys={filterKeys}/> : null
}

export interface TypeLabelProps {
  type: string | undefined
  showLabel?: boolean
}

export const TypeLabel: React.FunctionComponent<TypeLabelProps> = ({ type, showLabel = true }) => {
  let icon
  switch (type) {
    case 'string':
      icon = <div className='text-glyph'>T</div>
      break
    case 'number':
      icon = <div className='text-glyph'>1.0</div>
      break
    case 'integer':
      icon = <div className='text-glyph'>1</div>
      break
    case 'boolean':
      icon = <FontAwesomeIcon icon={faToggleOn} size='xs'/>
      break
    default:
      icon = ''
  }

  return (
    <span className='type-label'>
      <div className='type-icon'>{icon}</div>
      {
        showLabel && (
          <>
            &nbsp;&nbsp;{type}
          </>
        )
      }
    </span>
  )
}

const Row: React.FunctionComponent<RowProps> = ({ column }) => {
  // let typeContent

  return (
    <div className='row'>
      <div className='cell'>{column.title}</div>
      <div className='cell'>
        <TypeLabel type={column.type}/>
      </div>
      <div className='cell'>{column.description}</div>
      <div className='cell other-keywords'>{buildOtherKeywordsTable(column)}</div>
    </div>
  )
}

interface ColumnProperties {
  title?: string
  type?: string
  [key: string]: any
}

interface TwoDSchemaLayoutProps {
  schema: Schema
}

const TwoDSchemaLayout: React.FunctionComponent<TwoDSchemaLayoutProps> = ({ schema }) => {
  const columns = schemaColumns(schema)
  if (columns.length !== 0) {
    return (
      <div className='twod-schema-layout'>
        <div className='flex-table'>
          <div className='row header-row'>
            <div className='cell'>Title</div>
            <div className='cell'>Type</div>
            <div className='cell'>Description</div>
            <div className='cell capitalize other-keywords'>Other</div>
          </div>
          { columns.map((column: ColumnProperties, i: number) => {
            return <Row key={i} column={column} />
          })}
        </div>
      </div>
    )
  }

  return null
}

export default TwoDSchemaLayout
