import React from 'react'
import numeral from 'numeral'

import Icon from '../chrome/Icon'

interface DatasetStatProps {
  icon: string
  title: string
  value: number
  center?: boolean
}

const DatasetStat: React.FunctionComponent<DatasetStatProps> = ({ title, icon, value }) => {
  return (
    <div className='metric' title={title}>
      <Icon icon={icon} />&nbsp;&nbsp;{value > 1000 ? numeral(value).format('0.0a') : value}
    </div>
  )
}

export default DatasetStat
