import React, { useState, useRef, useContext } from "react";
import { UserUuidContext, UserNameContext } from "../App";

function Profile() {
  const userUuid = useContext(UserUuidContext);
  const user_name = useContext(UserNameContext);

  return (
    <section className="profile-container">
      <div className="profile-box">
        <h2 className="profile-label">{user_name}</h2>

        <div className="stats-box">
          <p>total games: 12</p>
          <p>average WPM: 103.98</p>
          <p>best WPM: 150</p>
        </div>
      </div>
    </section>
  );
}

export default Profile;
