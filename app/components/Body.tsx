import * as React from 'react'
import { ApiAction } from '../store/api'
import HandsonTable from './HandsonTable'
import { WorkingDataset } from '../models/store'

interface BodyProps {
  workingDataset: WorkingDataset
  headers: any[]
  fetchBody: () => Promise<ApiAction>
}

export default class Body extends React.Component<BodyProps> {
  constructor (props: BodyProps) {
    super(props)

    this.state = {}
  }

  static getDerivedStateFromProps (nextProps: BodyProps) {
    const { workingDataset } = nextProps
    const { value, bodyLoading: isLoading } = workingDataset
    const { body } = value
    if (
      body === undefined &&
      isLoading === false
    ) {
      nextProps.fetchBody()
      return null
    }

    return null
  }

  render () {
    return (
      <div>
        {
          this.props.workingDataset.value.body && (
            <HandsonTable
              headers={this.props.headers}
              body={this.props.workingDataset.value.body.data}
            />
          )
        }
      </div>
    )
  }
}
