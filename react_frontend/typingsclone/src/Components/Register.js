import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { SetIsLoggedInContext, IsLoggedInContext } from "../App";
import { useNavigate } from "react-router-dom";
import { SetUserNameContext, SetUuidContext } from "../App";

function Register() {
  const setUuid = useContext(SetUuidContext);
  const setUserName = useContext(SetUserNameContext);

  const [userUuid, setUserUuid] = useState("");
  const [user_name, setuser_name] = useState("");
  const [user_passwd_hash, setPassword] = useState("");
  const [confirmPasswd, setConfirmPasswd] = useState("");
  const setIsLoggedIn = useContext(SetIsLoggedInContext);

  const inputRefName = useRef(null);
  const inputRefPassword = useRef(null);
  const inputRefConfirm = useRef(null);

  const navigate = useNavigate();

  const handleFocus = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const handleClick = () => {
    navigate("/login");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const hashedPassword = CryptoJS.SHA256(user_passwd_hash).toString();
    const hasheConfirmPassword = CryptoJS.SHA256(confirmPasswd).toString();

    if (hasheConfirmPassword == hashedPassword) {
      const userData = {
        user_name,
        user_passwd_hash: hashedPassword,
      };

      try {
        console.log(userData);
        console.log(hashedPassword);
        const response = await axios.post(
          "http://localhost:8080/register",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setIsLoggedIn(true);
        setUuid(response.data.uuid);
        setUserName(response.data.name);
        console.log(userUuid);
        console.log(response.data);
        navigate("/");
      } catch (error) {
        console.error("Error:", error);
      }
    }

    e.preventDefault(); // Prevent form submission and page reload
  };

  return (
    <section>
      <h2 className="login-register-header">register</h2>
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

            <div className="input-box">
              <p className="label" onClick={() => handleFocus(inputRefConfirm)}>
                confirm:
              </p>
              <input
                value={confirmPasswd}
                onChange={(e) => setConfirmPasswd(e.target.value)}
                ref={inputRefConfirm}
                type="password"
                className="confirm-password-box"
                required
              />
            </div>

            <button
              type="submit"
              className="login-register-button"
              onClick={handleRegister} // Pass the event to prevent default form submission
            >
              register
            </button>
          </form>
        </div>
      </div>
      <button className="login-register-switch" onClick={handleClick}>
        already have an account?"
      </button>
    </section>
  );
}

export default Register;
