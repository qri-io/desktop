import * as React from 'react'
import ExternalLink from './ExternalLink'
import { Meta, Citation, License } from '../models/dataset'

interface MetadataProps {
  meta: Meta
}

const renderValue = (value: string | string[] | Citation[] | object) => {
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
    {value && value.map((d) => (<span key={d} className='chip'>{d}</span>))}
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

const renderTable = (keys: string[], data: Meta) => {
  return (
    <div className='metadata-viewer-table-wrap'>
      <table className='metadata-viewer-table'>
        <tbody>
          {keys.map((key) => {
            const value = data[key]
            let cellContent
            switch (key) {
              case 'theme':
              case 'keywords':
                cellContent = renderChips(value)
                break
              case 'license':
                cellContent = renderLicense(value)
                break
              case 'accessURL':
              case 'downloadURL':
              case 'readmeURL':
                cellContent = renderURL(value)
                break
              default:
                cellContent = renderValue(value)
            }

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

const Metadata: React.FunctionComponent<MetadataProps> = (props: MetadataProps) => {
  const { meta } = props
  const standardFields = [
    'title',
    'theme',
    'keywords',
    'description',
    'license',
    'accessURL',
    'language',
    'citations',
    'contributors',
    'accrualPeriodicity',
    'downloadURL',
    'homePath',
    'identifier',
    'readmePath',
    'version'
  ]

  const ignoreFields = ['qri', 'path']

  const standard = standardFields.filter((key) => !!meta[key])
  const extra = Object.keys(meta).filter((key) => {
    return !(~standardFields.findIndex((sKey) => (key === sKey)) || ~ignoreFields.findIndex((iKey) => (key === iKey)))
  })

  return (
    <div className='content metadata-viewer-wrap'>
      <h5 className='metadata-viewer-title'>Standard Metadata</h5>
      {renderTable(standard, meta)}

      {(extra.length > 0) && <div>
        <h5 className='metadata-viewer-title'>Additional Metadata</h5>
        {renderTable(extra, meta)}
      </div>}
    </div>
  )
}

export default Metadata
