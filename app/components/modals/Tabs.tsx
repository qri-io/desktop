import * as React from 'react'
import classNames from 'classnames'

interface TabProps {
  name: string
  active: boolean
  first: boolean
  last: boolean
  onClick: () => void
}

const Tab: React.FunctionComponent<TabProps> = ({ name, active, first, last, onClick }) => {
  const tabClassNames = classNames('tab', { active, first, last })
  return <div className={tabClassNames} onClick={onClick}>{name}</div>
}

interface TabsProps {
  tabs: string[]
  active: string
  onClick: (activeTab: string) => void
  id?: string
}

const Tabs: React.FunctionComponent<TabsProps> = ({ tabs, active, onClick, id }) =>
  <div className='tabs' id={id} >
    {
      tabs.map((name: string, index: number) => {
        let first = false
        let last = false
        if (index === 0) {
          first = true
        }
        if (index === tabs.length - 1) {
          last = true
        }
        return <Tab key={index} name={name} active={active === name} onClick={async () => onClick(name)} first={first} last={last} />
      })
    }
  </div>

export default Tabs
