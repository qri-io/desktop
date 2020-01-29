import React from 'react'
import { Dataset } from '../../models/dataset'
import TitleBar from './TitleBar'
import DatasetDetailsSubtext from './DatasetDetailsSubtext'
import Tag from '../item/Tag'

interface OverviewProps {
  data: Dataset
}

const Overview: React.FunctionComponent<OverviewProps> = ({ data }) => {
  const { meta, structure, name } = data

  const title = (meta && meta.title) || name
  const initDescription: string = (meta && meta.description) || ''

  const extendable = initDescription.length > 250

  const [description, setDescription] = React.useState(
    extendable ? `${initDescription.slice(0, 250)}...` : initDescription
  )

  const theme = meta && meta.theme && meta.theme.length > 0 && meta.theme[0]

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    if (!extendable) return
    if (initDescription === description) {
      setDescription(`${initDescription.slice(0, 250)}...`)
    } else {
      setDescription(initDescription)
    }
  }

  return (
    <div className='overview'>
      <TitleBar title={title} data={[]} />
      <DatasetDetailsSubtext size='md' color='dark' data={data}/>
      <div id='overview'>
        <div onClick={handleClick} className='description'>{description}</div>
        {theme && <Tag type='category' tag={theme} />}
      </div>
    </div>
  )
}

export default Overview
