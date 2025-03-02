import React from 'react';
import avatarImage from './cutecowprofile.png';

const UserProfile = ({ userData, onRetake }) => {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-body p-4 d-flex align-items-center">
            <div className="me-4">
              <img src={avatarImage} alt="Profile" style={{ width: '120px', borderRadius: '50%' }} />
            </div>
            <div>
              <h2>{userData?.basicInformation?.fullName || "User"}</h2>
              <p>Age: {userData?.basicInformation?.age || "-"}</p>
              <p>Height: {userData?.basicInformation?.height?.value || "-"} {userData?.basicInformation?.height?.unit || ""}</p>
              <p>Weight: {userData?.basicInformation?.weight?.value || "-"} {userData?.basicInformation?.weight?.unit || ""}</p>
              <p>Blood Type: {userData?.basicInformation?.bloodType || "-"}</p>
            </div>
            <button className="btn btn-outline-primary ms-auto" onClick={onRetake}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
