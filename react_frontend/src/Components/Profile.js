import React, { useState, useRef, useContext } from "react";
import { UserUuidContext, UserNameContext } from "../App";

function Profile() {
  const userUuid = useContext(UserUuidContext);
  const user_name = useContext(UserNameContext);

  return (
    <section>
      <div className="profile-box">
        <h2 className="profile-label">Profile Name</h2>
        <p className="profile-value">{user_name}</p>
        <hr className="divider" />
        <h2 className="profile-label">UUID</h2>
        <p className="profile-value">{userUuid}</p>
      </div>
    </section>
  );
}

export default Profile;
