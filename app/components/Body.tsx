import * as React from 'react'
import { ApiAction } from '../store/api'
import HandsonTable from './HandsonTable'

interface BodyProps {
  value: any[]
  isLoading: boolean
  headers: any[]
  history: boolean
  fetchBody: (history: boolean) => Promise<ApiAction>
}

export default class Body extends React.Component<BodyProps> {
  constructor (props: BodyProps) {
    super(props)

    this.state = {}
  }

  static getDerivedStateFromProps (nextProps: BodyProps) {
    const { value, isLoading, history } = nextProps
    if (
      value === undefined &&
      isLoading === false
    ) {
      nextProps.fetchBody(history)
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
