/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react'
import Icon from '../chrome/Icon'
import classNames from 'classnames'

interface OverlayProps {
  title?: string
  onCancel: () => void
  open: boolean
  height: number
  width: number
  navigation?: Element | undefined
}

const Overlay: React.FunctionComponent<OverlayProps> = ({
  height,
  width,
  title,
  onCancel,
  open,
  children,
  navigation
}) => {
  const overlayRef = React.useRef()

  const isInOverlay = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!onCancel || !overlayRef || !overlayRef.current) return

    // figure out if the user clicking inside the overlay
    const rect = overlayRef.current.getBoundingClientRect()

    // http://stackoverflow.com/a/26984690/2114
    const isIn =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width

    if (!isIn) {
      e.stopPropagation()
      onCancel()
    }
  }

  React.useEffect(() => {
    if (open) {
      window.addEventListener('click', isInOverlay)
    } else {
      window.removeEventListener('click', isInOverlay)
    }
    return () => (
      window.removeEventListener('click', isInOverlay)
    )
  }, [open])

  return (
    <div
      style={{ maxHeight: height, maxWidth: width }}
      className={classNames('overlay', { 'closed': !open })}
      ref={overlayRef}
    >
      {title && <div className='title-bar'>
        <div className='label x-small'>{title}</div>
        <div className='pointer' onClick={onCancel}><Icon icon='close' size='xs' /></div>
      </div>}
      {navigation && <div className='nav'>{navigation}</div>}
      <div className='content'>{children}</div>
    </div>
  )
}

export default Overlay
