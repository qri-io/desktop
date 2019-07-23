import * as React from 'react'
import * as classNames from 'classnames'

const Tab: React.FunctionComponent<any> = ({ name, active, first, last, onClick }) => {
  const tabClassNames = classNames('tab', { active, first, last })
  return <div className={tabClassNames} onClick={onClick}>{name}</div>
}

const Tabs: React.FunctionComponent<any> = ({ tabs, active, onClick }) =>
  <div className='tabs'>
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
