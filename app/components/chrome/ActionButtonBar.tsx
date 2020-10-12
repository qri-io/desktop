import React from 'react'
import classNames from 'classnames'
import sizeMe, { SizeMeProps } from 'react-sizeme'

import { DatasetAction } from '../../models/dataset'

import ActionButton from './ActionButton'
import Hamburger from './Hamburger'

interface ActionButtonBarProps {
  data: DatasetAction[]
  size: SizeMeProps['size']
}

const ActionButtonBar: React.FunctionComponent<ActionButtonBarProps> = (props) => {
  const { data, size } = props
  if (data.length === 0) return null
  if (size.width && size.width < 40) {
    return <Hamburger id='action-button-bar-hamburger' items={data} />
  }
  const [areVisible, setAreVisible] = React.useState<boolean[]>(data.map(() => true))

  const [buttonSizes, setButtonSizes] = React.useState<number[]>(data.map(() => 0))

  const handleSize = (width: number | null, index: number) => {
    setButtonSizes((prev: number[]) => {
      if (width === null) return prev
      let buttonSizes = prev.slice()
      buttonSizes[index] = width
      return buttonSizes
    })
  }

  const buttons = data.map((d: DatasetAction, i: number) =>
    <div className={classNames({ 'closed': !areVisible[i] })} key={i}>
      <ActionButton icon={d.icon} onClick={d.onClick} text={d.text} onSize={(size: { width: number | null, height: number | null }) => handleSize(size.width, i)}/>
    </div>
  )

  React.useEffect(() => {
    if (size.width === null) return

    let cumulativeSize = 40 // hamburger width
    for (let i = 0; i < data.length; i++) {
      cumulativeSize += buttonSizes[i]
      // if the cumulativeSize is larger then size, set all the buttons before this
      // point visible, and after this point not visible.
      if (cumulativeSize > size.width) {
        setAreVisible((prev: boolean[]) => {
          return prev.map((val: boolean, j: number) => j < i)
        })
        break
      }
      if (i === data.length - 1) {
        setAreVisible((prev: boolean[]) => prev.map(() => true))
      }
    }
  }, [size, buttonSizes])
  return (
    <div className='action-button-bar'>
      {buttons}
      {/* If any are not visible, show the hamburger */}
      {areVisible.some((val: boolean) => val === false) && <Hamburger items={data.filter((d: DatasetAction, i: number) => {
        if (!areVisible[i]) return d
        else return undefined
      })}/>}
    </div>
  )
}

export default sizeMe()(ActionButtonBar)
