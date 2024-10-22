import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom' // Use BrowserRouter
import "./styles.css"
import CommandCenter from './Components/CommandCenter';
import LoginRegister from './Components/LoginRegister';
import { FaUser } from "react-icons/fa";export const IsTimerActive = React.createContext()
export const SetStopTimer = React.createContext()
export const ElapsedTimeContext = React.createContext()
export const SetElapsedTimeContext = React.createContext()
export const SetWpmContext = React.createContext()
export const WpmContext = React.createContext()
export const IsWordValidContext = React.createContext()
export const SetIstWordValidContext = React.createContext()

function App() {
  const [wpm, setWpm] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isWordValid, setIsWordValid] = useState([])

  return (
    <BrowserRouter> {/* Updated */}
      <div className="typer">
        <Link to="/">
          <div className="header">
            Typer
            <Link to="/login">
              <FaUser className="account-icon" color='#c9c0af' />
            </Link>
          </div>
        </Link>
        <SetElapsedTimeContext.Provider value={setElapsedTime}>
          <ElapsedTimeContext.Provider value={elapsedTime}>
            <WpmContext.Provider value={wpm}>
              <IsTimerActive.Provider value={isActive}>
                <SetStopTimer.Provider value={setIsActive}>
                  <SetWpmContext.Provider value={setWpm}>
                    <IsWordValidContext.Provider value={isWordValid}>
                      <SetIstWordValidContext.Provider value={setIsWordValid}>
                        <Routes>
                          <Route path="/" element={<CommandCenter />} />
                          <Route path="/login" element={<LoginRegister />} />
                        </Routes>
                      </SetIstWordValidContext.Provider>
                    </IsWordValidContext.Provider>
                  </SetWpmContext.Provider>
                </SetStopTimer.Provider>
              </IsTimerActive.Provider>
            </WpmContext.Provider>
          </ElapsedTimeContext.Provider>
        </SetElapsedTimeContext.Provider>
        <div className="footer">user guide / themes</div>
      </div>
    </BrowserRouter>
  )
}

export default App;
