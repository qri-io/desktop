import * as React from 'react'

import ExternalLink from './ExternalLink'
import KeyValueTable from './KeyValueTable'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import { standardFields } from './MetadataEditor'
import { Meta, Citation, License, User } from '../models/dataset'

import { isUserArray } from './form/MultiStructuredInput'

interface MetadataProps {
  meta: Meta
}

const renderValue = (value: string | string[] | object) => {
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

const renderChips = (value: string[] | undefined) => (
  <div>
    {value && value.map((d, i) => (<span key={i} className='chip'>{d}</span>))}
  </div>
)

const renderLicense = (license: License) => (
  <ExternalLink href={license.url}>
    {license.type}
  </ExternalLink>
)

const renderURL = (url: string) => (
  <ExternalLink href={url}>{url}</ExternalLink>
)

const renderArrayItemsTable = (value: any[]) => {
  return (
    <div className='array-items-table-container'>
      {
        value.map((item, i) => (<div key={i}><KeyValueTable data={item} /></div>))
      }
    </div>
  )
}

const renderMultiStructured = (value: User[] | Citation[]) => {
  if (isUserArray(value)) {
    return renderArrayItemsTable(value)
  }

  return renderArrayItemsTable(value)
}

const renderTable = (keys: string[], data: Meta) => {
  return (
    <div className='keyvalue-table-wrap'>
      <table className='keyvalue-table'>
        <tbody>
          {keys.map((key) => {
            const value = data[key]
            let cellContent
            switch (key) {
              case 'theme':
              case 'keywords':
              case 'language':
                cellContent = renderChips(value)
                break
              case 'license':
                cellContent = renderLicense(value)
                break
              case 'accessURL':
              case 'downloadURL':
              case 'readmeURL':
              case 'homeURL':
                cellContent = renderURL(value)
                break
              case 'contributors':
              case 'citations':
                cellContent = renderMultiStructured(value)
                break
              default:
                cellContent = renderValue(value)
            }

            return (
              <tr key={key} className='keyvalue-table-row'>
                <td className='keyvalue-table-key'>{key}</td>
                <td id={`meta-${key}`}>{cellContent}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const Metadata: React.FunctionComponent<MetadataProps> = (props: MetadataProps) => {
  const { meta } = props

  if (!meta) {
    return <SpinnerWithIcon loading={true} />
  }

  const ignoreFields = ['qri', 'path']

  const standard = standardFields.filter((key) => !!meta[key])
  const extra = Object.keys(meta).filter((key) => {
    return !(~standardFields.findIndex((sKey) => (key === sKey)) || ~ignoreFields.findIndex((iKey) => (key === iKey)))
  })

  return (
    <div className='content metadata-viewer-wrap'>
      <h4 className='metadata-viewer-title'>Standard Metadata</h4>
      {renderTable(standard, meta)}

      {(extra.length > 0) && <div>
        <h4 className='metadata-viewer-title'>Additional Metadata</h4>
        {renderTable(extra, meta)}
      </div>}
    </div>
  )
}

export default Metadata
