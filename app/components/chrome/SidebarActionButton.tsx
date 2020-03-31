import React from 'react'

import Button from './Button'

interface SidebarActionButtonProps {
  text: string
  onClick: (e: React.MouseEvent) => Promise<void>
}

/**
 * TODO (ramfox): currently this SidebarActionButton just wraps 'button', having
 * the button spin when the action is occurring and setting off a toast when
 * the action is successful or results in an error
 * However, I would like to extend this component to include the ProgressBar,
 * so that we have the option to, instead of showing a loading spinner, show
 * a progress bar instead
 */
const SidebarActionButton: React.FunctionComponent<SidebarActionButtonProps> = (props) => {
  const [loading, setLoading] = React.useState(false)

  const handleOnClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    await onClick(e).catch(() => setLoading(false))
  }
  const { text, onClick } = props
  return (
    <div className='sidebar-action-button'>
      <Button id='sidebar-action' text={text.toUpperCase()} color='primary' full onClick={handleOnClick} loading={loading} />
    </div>
  )
}

export default SidebarActionButton
