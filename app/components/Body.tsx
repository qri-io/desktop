import * as React from 'react'
import { ApiAction } from '../store/api'
import HandsonTable from './HandsonTable'

export interface BodyProps {
  value: any[]
  isLoading: boolean
  headers: any[]
  onFetch: () => Promise<ApiAction>
}

export default class Body extends React.Component<BodyProps> {
  constructor (props: BodyProps) {
    super(props)

    this.state = {}
  }

  static getDerivedStateFromProps (nextProps: BodyProps) {
    const { value, isLoading, onFetch } = nextProps
    if (
      value === undefined &&
      isLoading === false
    ) {
      console.log('CALLING FOR BODY')
      onFetch()
      return null
    }

    return null
  }

  render () {
    return (
      <div>
        {
          this.props.value && (
            <HandsonTable
              headers={this.props.headers}
              body={this.props.value}
            />
          )
        }
      </div>
    )
  }
}
