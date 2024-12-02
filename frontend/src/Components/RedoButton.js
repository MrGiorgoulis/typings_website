import React, { useContext } from 'react'
import { RedoStateUpdateContext } from './CommandCenter'
import { SetStopTimer } from '../App'

function RedoButton() {

  const setTimer = useContext(SetStopTimer)
  const updateRedoState = useContext(RedoStateUpdateContext)

  const handleClick = () => {
    setTimer(false)
    updateRedoState()
  }

  return (
    <button className="redo-button" onClick={handleClick}>redo</button>
  )
}

export default RedoButton