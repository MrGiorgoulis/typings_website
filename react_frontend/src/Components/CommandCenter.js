import React, { useState, useCallback } from "react";
import SettingsBar from "./SettingsBar";
import MainContainer from "./MainContainer";

export const WordCountContext = React.createContext()
export const UpdateWordCountContext = React.createContext()
export const RedoStateContext = React.createContext()
export const RedoStateUpdateContext = React.createContext()

function CommandCenter() {

  const [redoState, setRedoState] = useState(true)
  const [wordCnt, setWordCnt] = useState(10)

  const updateRedoState = useCallback(() => {
    setRedoState(prevState => !prevState)
  }, [])

  return (
    <div className="command-center">
      <RedoStateContext.Provider value={redoState}>
        <RedoStateUpdateContext.Provider value={updateRedoState}>
          <WordCountContext.Provider value={wordCnt}>
            <UpdateWordCountContext.Provider value={setWordCnt}>
              <SettingsBar />
            </UpdateWordCountContext.Provider>
            <MainContainer className="main-container" />
          </WordCountContext.Provider>
        </RedoStateUpdateContext.Provider>
      </RedoStateContext.Provider>
    </div>
  )
}

export default CommandCenter