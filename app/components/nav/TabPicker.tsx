import React from 'react'

import classNames from 'classnames'

interface TabPickerProps {
  size: 'sm' | 'md'
  color: 'light' | 'dark'
  tabs: string[]
  onClick: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void
  activeTab: string
}

const TabPicker: React.FunctionComponent<TabPickerProps> = ({
  size = 'sm',
  color = 'dark',
  tabs,
  onClick,
  activeTab
}) => {
  return (
    <div className={
      classNames('tab-picker', {
        'small': size === 'sm',
        'medium': size === 'md',
        'light': color === 'light',
        'dark': color === 'dark'
      })
    }>
      {
        tabs.map((name: string, i: number) => {
          return (<div
            key={i}
            onClick={onClick}
            className={classNames({ 'active': name === activeTab })}
            data-value={name}
          >
            {name}
          </div>)
        })
      }
    </div>
  )
}

export default TabPicker
