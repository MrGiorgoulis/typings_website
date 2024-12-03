import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // Use BrowserRouter
import "./styles.css";
import CommandCenter from "./Components/CommandCenter";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import UserGameHistory from "./Components/UserGameHistory";

export const IsTimerActive = React.createContext();
export const SetStopTimer = React.createContext();
export const ElapsedTimeContext = React.createContext();
export const SetElapsedTimeContext = React.createContext();
export const SetWpmContext = React.createContext();
export const WpmContext = React.createContext();
export const IsWordValidContext = React.createContext();
export const SetIstWordValidContext = React.createContext();
export const SetIsLoggedInContext = React.createContext();
export const IsLoggedInContext = React.createContext();
export const UserUuidContext = React.createContext();
export const SetUuidContext = React.createContext();
export const UserNameContext = React.createContext();
export const SetUserNameContext = React.createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wpm, setWpm] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isWordValid, setIsWordValid] = useState([]);
  const [userUuid, setUserUuid] = useState(null);
  const [user_name, setuser_name] = useState("");

  useEffect(() => {
    const handleLogin = async (e) => {
      // e.preventDefault(); // Prevent form submission and page reload

      try {
        const response = await axios.get(
          "http://localhost:8080/get_anonymous",
          {
            params: {
              user_name: "",
              user_passwd_hash: "",
            },
          }
        );
        setUserUuid(response.data.uuid);
        setuser_name(response.data.name);
        console.log(response.data);
      } catch (error) {
        console.error("Error Setting Default User in:", error.message); // Log only the error message
        if (error.response) {
          console.error("Server responded with:", error.response.data); // Log server's error response
        }
      }
    };

    handleLogin();
  }, []); // The empty array ensures this effect runs only once

  return (
    <BrowserRouter>
      <div className="typer">
        <UserNameContext.Provider value={user_name}>
          <SetUserNameContext.Provider value={setuser_name}>
            <UserUuidContext.Provider value={userUuid}>
              <SetUuidContext.Provider value={setUserUuid}>
                <SetIsLoggedInContext.Provider value={setIsLoggedIn}>
                  <IsLoggedInContext.Provider value={isLoggedIn}>
                    <SetElapsedTimeContext.Provider value={setElapsedTime}>
                      <ElapsedTimeContext.Provider value={elapsedTime}>
                        <WpmContext.Provider value={wpm}>
                          <IsTimerActive.Provider value={isActive}>
                            <SetStopTimer.Provider value={setIsActive}>
                              <SetWpmContext.Provider value={setWpm}>
                                <IsWordValidContext.Provider
                                  value={isWordValid}
                                >
                                  <SetIstWordValidContext.Provider
                                    value={setIsWordValid}
                                  >
                                    <div className="header">
                                      <Link to="/">
                                        <div className="home-link">Typer</div>
                                      </Link>
                                      <Link
                                        to={isLoggedIn ? "/profile" : "/login"}
                                      >
                                        <FaUser
                                          className="account-icon"
                                          color="#c9c0af"
                                        />
                                      </Link>
                                    </div>
                                    <Routes>
                                      <Route
                                        path="/"
                                        element={<CommandCenter />}
                                      />
                                      <Route
                                        path="/login"
                                        element={<Login />}
                                      />
                                      <Route
                                        path="/register"
                                        element={<Register />}
                                      />
                                      <Route
                                        path="/profile"
                                        element={<Profile />}
                                      ></Route>
                                      <Route
                                        path="/game_history"
                                        element={<UserGameHistory />}
                                      ></Route>
                                    </Routes>
                                  </SetIstWordValidContext.Provider>
                                </IsWordValidContext.Provider>
                              </SetWpmContext.Provider>
                            </SetStopTimer.Provider>
                          </IsTimerActive.Provider>
                        </WpmContext.Provider>
                      </ElapsedTimeContext.Provider>
                    </SetElapsedTimeContext.Provider>
                  </IsLoggedInContext.Provider>
                </SetIsLoggedInContext.Provider>
              </SetUuidContext.Provider>
            </UserUuidContext.Provider>
          </SetUserNameContext.Provider>
        </UserNameContext.Provider>
        <div className="footer">user guide / themes</div>
      </div>
    </BrowserRouter>
  );
}

export default App;
