import React from 'react'
import Icon from '../chrome/Icon'
import classNames from 'classnames'

interface SegmentProps {
  name: string
  content: React.Component | Element | null

  icon?: string
  subhead?: string
  collapsable?: boolean
  expandable? : boolean
  contentHeight?: number
}

const Segment: React.FunctionComponent<SegmentProps> = (props) => {
  const { name, subhead, content, icon, collapsable = false, expandable = false, contentHeight = 400 } = props

  if (content === null) return null

  const [isOpen, setIsOpen] = React.useState(true)
  const [isExpanded, setIsExpanded] = React.useState(false)

  let heightStyle = {}

  // if we are expanded, don't give any maxHeight styling, as this will
  // conflict with the expanded styling
  if (!isExpanded) {
    // switch on isOpen, the transition is handled in the `.segment .content` class
    heightStyle = { maxHeight: isOpen ? contentHeight : 0 }
  }

  return (
    <div className={classNames('segment', { 'segment-expanded': isExpanded })}>
      <header className={classNames({ 'content-closed': !isOpen })}>

        {
          // if we are expanded, don't let the user 'collapse' the segment
          collapsable && !isExpanded &&
            <div className='caret' onClick={() => setIsOpen(!isOpen)}>
              <Icon icon={isOpen ? 'angle-down' : 'angle-right'} size='md' />
            </div>
        }
        <div className='left-side'>
          {icon && <div className='segment-icon'><Icon icon={icon} size='md' /></div>}
          <div className='text'>
            <h4 className='name'>{name}</h4>
            <small className='subhead'>{subhead}</small>
          </div>
        </div>
        <div className='right-side'>
          {/* ensure the container div you want to expand to has the css */}
          {/* property 'position: relative' */}
          {expandable &&
            <div className='expand' onClick={() => setIsExpanded(!isExpanded)}>
              <Icon icon={ isExpanded ? 'close' : 'expand'} />
            </div>
          }
        </div>
      </header>
      {/* the .content div has no padding/margin */}
      <div className='content' style={heightStyle}>
        {/* you must set padding/margin in the passed in `content` element */}
        {content}
      </div>
    </div>
  )
}

export default Segment
