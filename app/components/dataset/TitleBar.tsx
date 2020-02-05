import React from 'react'
import classNames from 'classnames'

import { DatasetAction } from '../../models/dataset'

import ActionButtonBar from '../chrome/ActionButtonBar'
import Icon from '../chrome/Icon'


interface TitleBarProps {
  icon?: string
  title: string
  data: DatasetAction[]
}

const TitleBar: React.FunctionComponent<TitleBarProps> = (props) => {
  const { icon, title, data } = props

  const [expanded, setExpanded] = React.useState(false)
  const [expandable, setExpandable] = React.useState(false)

  const wrapRef = React.useRef<HTMLDivElement>(null)

  const titleRefWithCallback = () => {
    const ref = React.useRef<HTMLDivElement>(null)
    const setRef = React.useCallback((el: HTMLDivElement) => {
      if (el !== null) {
        if (el.offsetWidth < el.scrollWidth) {
          setExpandable(true)
          return
        }
        if (expandable) setExpandable(false)
      }
    }, [])
    ref.current = setRef
    return [setRef]
  }

  const [titleRef] = titleRefWithCallback()

  // const titleRef = React.useRef<HTMLDivElement>(null)
  const rightRef = React.useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // if you click on the title while there is an elipses
    // expand the content
    if (expandable) {
      if (expanded) setExpanded(false)
      else setExpanded(true)
      return
    }
    // otherwise, if expanded is true, set it false
    if (expanded) setExpanded(false)
  }

  return (
    <div ref={wrapRef} className='title-bar'>
      <div
        onClick={handleClick}
        className={classNames('left', {
          'expandable': expandable,
          'expanded': expanded
        })}>
        {icon &&
          <div className='title-bar-icon'>
            <Icon icon={icon} size='md' />
          </div>
        }
        <div ref={titleRef} className={classNames('title-bar-title', {
          'expanded': expanded
        })}>{title}</div>
      </div>
      <div ref={rightRef} className='right'>
        <ActionButtonBar data={data}/>
      </div>
    </div>
  )
}

export default TitleBar
