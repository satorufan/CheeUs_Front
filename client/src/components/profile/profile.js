import React, { useState, useContext } from 'react';
import { AuthContext } from '../login/OAuth';

const Profile = () => {
  const {memberEmail} = useContext(AuthContext);

  return (
    <div className="profile-container">
      <div>profile</div>
      <div>{memberEmail}</div>
    </div>
  );
};

export default Profile;