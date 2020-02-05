import * as React from 'react'
import { Link } from 'react-router-dom'

interface BreadcrumbProps {
  id?: string
  value: string // the text written on the button
}

// Breadcrumb is a the basic button used throughout the app
const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = (props) => {
  const { value } = props

  // remove the base route from the breadcrumb
  // TODO (ramfox): we need a uniform way of doing this to work for all routes
  // this falls into our question of whether we pass around location strings
  // or de-multiplexed params
  // expect this to change
  const crumb = value.split('/').slice(2).join('/')
  return (
    <div id={props.id} className='breadcrumb'>
      {/**
        * TODO (ramfox): this is just a stand in for now, eventually, each
        * portion of the path should link to a route that makes sense
        */}
      <Link to={value}>{crumb}</Link>
    </div>
  )
}

export default Breadcrumb
