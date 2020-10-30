import React from 'react'

import Store, { RouteProps } from '../../../models/store'
import { Meta, Citation, License, User } from '../../../models/dataset'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToProps } from '../../../utils/connectComponentToProps'

import { selectDataset, selectDatasetIsLoading } from '../../../selections'

import { isUserArray } from '../../form/MetadataMultiInput'
import ExternalLink from '../../ExternalLink'
import KeyValueTable from '../../KeyValueTable'
import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'
import { standardFields } from './MetadataEditor'

interface MetadataProps extends RouteProps {
  qriRef: QriRef
  data: Meta
  loading: boolean
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
  <ExternalLink id='render-license' href={license.url}>
    {license.type}
  </ExternalLink>
)

const renderURL = (url: string) => (
  <ExternalLink id='render-url' href={url}>{url}</ExternalLink>
)

const renderArrayItemsTable = (value: any[]) => {
  return (
    <div className='array-items-table-container'>
      {
        value.map((item, i) => (<div key={i}><KeyValueTable index={i} data={item} /></div>))
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

export const MetadataComponent: React.FunctionComponent<MetadataProps> = ({ data, loading }) => {
  if (loading) {
    return <SpinnerWithIcon loading />
  }

  // TODO (b5) - this should happen at the point of ingest from the API
  const ignoreFields = ['qri', 'path']
  const standard = standardFields.filter((key) => !!data[key])
  const extra = Object.keys(data).filter((key) => {
    return !(~standardFields.findIndex((sKey) => (key === sKey)) || ~ignoreFields.findIndex((iKey) => (key === iKey)))
  })

  return (
    <div className='content metadata-viewer-wrap'>
      <h4 className='metadata-viewer-title'>Standard Metadata</h4>
      {renderTable(standard, data)}

      {(extra.length > 0) && <div>
        <h4 className='metadata-viewer-title'>Additional Metadata</h4>
        {renderTable(extra, data)}
      </div>}
    </div>
  )
}

// TODO (b5) - this component doesn't need to be a container. Just feed it the right data
export default connectComponentToProps(
  MetadataComponent,
  (state: Store, ownProps: MetadataProps) => {
    // get data for the currently selected component
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps),
      loading: selectDatasetIsLoading(state),
      data: selectDataset(state).meta
    }
  }
)
