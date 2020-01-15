import React from 'react'
import Icon from '../chrome/Icon'

interface SegmentProps {
  name: string
  content: React.Component

  icon?: string
  subhead?: string
  collapsable?: boolean
  contentHeight?: number
}

const Segment: React.FunctionComponent<SegmentProps> = (props) => {
  const { name, subhead, content, icon, contentHeight = 400 } = props

  return (
    <div className='segment'>
      <header>
        <div className='left_side'>
          {icon && <Icon icon={icon} />}
          <span className='text'>
            <h4 className='name'>{name}</h4>
            <small className='subhead'>{subhead}</small>
          </span>
        </div>
      </header>
      <div className='content' style={{ maxHeight: contentHeight }}>
        {content}
      </div>
    </div>
  )
}

export default Segment
