import React, { useState, useEffect } from 'react'

import events from './data/remoteEvents.json'

import { TransfersComponent } from '../app/components/Transfers'

export default {
  title: 'Transfers',
  parameters: {
    notes: ''
  }
}

const stepLength = 1000

export const Transfers = () => {
  const [ step, setStep ] = useState(0)
  const increase = () => {
    if (step + 1 === events.length) {
      setStep(0)
      return
    }
    setStep(step + 1)
  }

  let timer = setInterval(increase, stepLength)
  useEffect(() => {
    return () => {
      clearTimeout(timer)
    }
  }, [ step ])

  return <TransfersComponent transfers={events[step]} />
}

Transfers.story = {
  name: 'Transfers',
  parameters: { note: 'caution: uses live data' }
}
