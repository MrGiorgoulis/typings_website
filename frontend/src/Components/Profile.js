import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserNameContext, SetUserNameContext, SetUuidContext, SetIsLoggedInContext, UserUuidContext} from "../App";
import { useNavigate } from "react-router-dom";

function Profile() {
  const user_name = useContext(UserNameContext);
  const setuser_name = useContext(SetUserNameContext);
  const user_uuid = useContext(UserUuidContext);
  const setUserUuid = useContext(SetUuidContext);
  const setIsLoggedIn = useContext(SetIsLoggedInContext);

  const [total_games, set_total_games] = useState();
  const [average_wpm, set_average_wpm] = useState();
  const [best_wpm, set_best_wpm] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:8080/user", {
          params: {
            user_uuid: user_uuid
          },
        });
        console.log(response.data.total_games)
  
        set_total_games(response.data.total_games);
        set_average_wpm(response.data.wpm_avg.toFixed(2));
        set_best_wpm(response.data.wpm_best.toFixed(2));
  
      } catch (error) {
        console.log("User not retrieved", error);
      }
    }

    fetchData();
  }, [])

  const logout = async () => {
    try {
      const response = await axios.get("http://localhost:8080/get_anonymous", {
        params: {
          user_name: '',
          user_passwd_hash: ''
        },
      });
      
      setUserUuid(response.data.uuid);
      setuser_name(response.data.name);
      setIsLoggedIn(false);

      navigate("/");
      console.log(response.data);
    } catch (error) {
      console.error("Error Setting Default User in:", error.message);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
    }
  };

  return (
    <section className="profile-container">
      <div className="profile-box">
        <h2 className="profile-label">{user_name}</h2>

        <div className="stats-box">
          <p className="stats-label">total games: {total_games}</p>
          <p className="stats-label">average WPM: {parseFloat(average_wpm)}</p>
          <p className="stats-label">best WPM: {parseFloat(best_wpm)}</p>
        </div>
      </div>
      <button className="logout-button" onClick={() => logout()}>Logout</button>
    </section>
  );
}

export default Profile;
