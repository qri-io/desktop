import * as React from 'react'
import { Link } from 'react-router-dom'

interface BreadcrumbProps {
  id?: string
  value: string // the text written on the button
}

// Breadcrumb is a the basic button used throughout the app
const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = (props) => (
  <div id={props.id} className='breadcrumb'>
    <Link to='/'>bread</Link> / <Link to='/'>crumb</Link>
  </div>
)

export default Breadcrumb
