import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { Details, DetailsType, StatsDetails } from '../models/details'

import { connectComponentToProps } from '../utils/connectComponentToProps'

import { setDetailsBar } from '../actions/ui'

import { Header } from './collection/datasetComponents/Body'
import { TypeLabel } from './TwoDSchemaLayout'
import { StatDiffItem } from './item/StatDiffRow'

export interface DetailsBarProps {
  details: Details
  setDetailsBar: (details: Details) => void
}
const DetailsBarComponent: React.FunctionComponent<DetailsBarProps> = (props) => {
  const {
    details,
    setDetailsBar
  } = props

  const renderStatsDetails = () => {
    const statsDetails = details as StatsDetails
    return (
      <div>
        {renderHeader()}
        <div className="details-bar-content">
          <StatDiffItem title={statsDetails.title} type={statsDetails.stats.type} data={statsDetails.stats} />
        </div>
      </div>
    )
  }

  const onDismiss = () => {
    setDetailsBar({ type: DetailsType.NoDetails })
  }

  const renderHeader = (header?: Header) => {
    return (<div className="details-bar-header">
      {header && <h3>{header.title}</h3>}
      {header && <h4><TypeLabel type={header.type} /></h4>}
      <a
        className="close"
        onClick={onDismiss}
        aria-label="close"
        role="button"
      >
        <FontAwesomeIcon icon={faTimes} size='lg'/>
      </a>
    </div>)
  }

  return <div className='details-bar padding'>
    {details.type === DetailsType.StatsDetails && renderStatsDetails()}
  </div>
}

export default connectComponentToProps(
  DetailsBarComponent,
  (state: any) => {
    const { ui } = state
    return {
      details: ui.detailsBar
    }
  },
  {
    setDetailsBar
  }
)
