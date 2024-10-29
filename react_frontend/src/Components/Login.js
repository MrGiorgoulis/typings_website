import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { SetUuidContext, SetUserNameContext } from "../App";
import { SetIsLoggedInContext, IsLoggedInContext } from "../App";

function Login() {
  const setUuid = useContext(SetUuidContext);
  const setUserName = useContext(SetUserNameContext);
  const setIsLoggedIn = useContext(SetIsLoggedInContext);

  const [user_name, setuser_name] = useState("");
  const [user_passwd_hash, setPassword] = useState("");

  const inputRefName = useRef(null);
  const inputRefPassword = useRef(null);

  const navigate = useNavigate();

  const handleFocus = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const handleClick = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission and page reload
    const hashedPassword = CryptoJS.SHA256(user_passwd_hash).toString();

    const userData = {
      user_name,
      user_passwd_hash: hashedPassword,
    };

    try {
      console.log(userData);
      const response = await axios.get("http://localhost:8080/login", {
        params: {
          user_name: userData.user_name,
          user_passwd_hash: userData.user_passwd_hash,
        },
      });
      setIsLoggedIn(true);
      setUuid(response.data.uuid);
      setUserName(response.data.name);
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error.message); // Log only the error message
      if (error.response) {
        console.error("Server responded with:", error.response.data); // Log server's error response
      }
    }

    e.preventDefault();
  };

  return (
    <section>
      <h2 className="login-register-header">login</h2>
      <div className="form-box">
        <div className="form-inside">
          <form action="" className="main-form">
            <div className="input-box">
              <p className="label" onClick={() => handleFocus(inputRefName)}>
                name:
              </p>
              <input
                value={user_name}
                onChange={(e) => setuser_name(e.target.value)}
                ref={inputRefName}
                type="text"
                className="email-box"
                required
              />
            </div>
            <div className="input-box">
              <p
                className="label"
                onClick={() => handleFocus(inputRefPassword)}
              >
                password:
              </p>
              <input
                value={user_passwd_hash}
                onChange={(e) => setPassword(e.target.value)}
                ref={inputRefPassword}
                type="password"
                className="password-box"
                required
              />
            </div>
            <button
              type="submit"
              className="login-register-button"
              onClick={handleLogin} // Pass the event to prevent default form submission
            >
              login
            </button>
          </form>
        </div>
      </div>
      <button className="login-register-switch" onClick={handleClick}>
        create an account
      </button>
    </section>
  );
}

export default Login;
