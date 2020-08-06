import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { Details, DetailsType, StatsDetails } from '../models/details'

import { connectComponentToProps } from '../utils/connectComponentToProps'

import { setDetailsBar } from '../actions/ui'

import StatsChart from './StatsChart'
import StatsChartV1 from './statsChartV1/StatsChartV1'
import { Header } from './workbench/components/Body'
import { TypeLabel } from './TwoDSchemaLayout'

import styles from './detailsBar.module.scss'

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
        {renderHeader(statsDetails.title, statsDetails.stats.type)}
        <div className="details-bar-content">
          <StatsChart data={statsDetails.stats} />
          <StatsChartV1 data={statsDetails.stats} fontFamily={styles.fontFamily}/>
        </div>
      </div>
    )
  }

  const onDismiss = () => {
    setDetailsBar({ type: DetailsType.NoDetails })
  }

  const renderHeader = (header: Header) => {
    return (<div className="details-bar-header">
      <h3>{header.title}</h3>
      <h4><TypeLabel type={header.type} /></h4>
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
