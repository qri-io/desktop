import * as React from 'react'
import { ApiAction } from '../store/api'
import HandsonTable from './HandsonTable'

interface BodyProps {
  body: any
  fetchBody: () => Promise<ApiAction>
}

export default class Body extends React.Component<BodyProps> {
  componentDidMount () {
    console.log('DIDMOUNT')
    this.props.fetchBody()
  }
  render () {
    return (
      <div>
        {
          this.props.body && (
            <HandsonTable body={this.props.body.data} />
          )
        }
      </div>
    )
  }
}
