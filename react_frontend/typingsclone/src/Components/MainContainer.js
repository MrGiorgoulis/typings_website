import React, { useContext, useEffect, useState } from 'react'
import FetchData from './FetchData'
import InputContainer from './InputContainer'
import { RedoStateContext } from './CommandCenter'
import { IsWordValidContext, SetIstWordValidContext } from '../App'

export const RandomWordsContext = React.createContext()
export const SetRandomWordsContext = React.createContext()

function MainContainer() {

  const [randomWords, setRandomWords] = useState([])

  const isWordValid = useContext(IsWordValidContext)
  const setIsWordValid = useContext(SetIstWordValidContext)
  const redoState = useContext(RedoStateContext)

  useEffect(() => {
    setIsWordValid([])
  }, [redoState])

  return (
    <div>
      <SetRandomWordsContext.Provider value={setRandomWords}>
        <RandomWordsContext.Provider value={randomWords}>
          <div className="main-container">
            <FetchData />
            <InputContainer />
          </div>
        </RandomWordsContext.Provider>
      </SetRandomWordsContext.Provider>
    </div>
  )
}

export default MainContainer