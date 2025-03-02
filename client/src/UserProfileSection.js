import React from 'react';

import avatarImage from '../public/cutecowprofile.png';

const UserProfileSection = ({ userData }) => {
  // Get user data or set defaults if not available
  const { 
    basicInformation = {
      fullName: "User",
      age: "-",
      weight: { value: "-", unit: "" },
      height: { value: "-", unit: "" },
      bloodType: "-"
    }
  } = userData || {};

  // Default avatar image or use placeholder
  const avatarUrl = "/cutecowprofile.png";

  // Color palette based on your theme
  const colors = {
    primary: '#8B80F9',    // Main purple color
    secondary: '#A594F9',  // Lighter purple
    light: '#EAE6FF',      // Very light purple/lavender
    accent1: '#FFD6E0',    // Soft pink
    accent2: '#A1EAFB',    // Soft blue
    text: '#2A2D43',       // Dark blue/purple for text
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div 
          className="card border-0 rounded-4 shadow-sm"
          style={{ background: 'white' }}
        >
          <div className="card-body p-4">
            <div className="d-flex flex-wrap align-items-center">
              {/* Profile Picture */}
              <div className="me-4 mb-3 mb-md-0">
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `3px solid ${colors.primary}`,
                    boxShadow: '0 4px 10px rgba(139, 128, 249, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
 <img src={avatarImage} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
              </div>

              {/* User Information */}
              <div className="flex-grow-1">
                <h2 
                  style={{ 
                    color: colors.text, 
                    fontSize: '1.8rem',
                    marginBottom: '0.5rem' 
                  }}
                >
                  {basicInformation.fullName || "User"}
                </h2>
                
                <div className="row mt-3">
                  <div className="col-md-6 col-lg-3 mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{ 
                          width: '28px',
                          height: '28px',
                          background: colors.light,
                          color: colors.primary
                        }}
                      >
                        <i className="bi bi-calendar3"></i>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7 }}>Age</span>
                        <p style={{ margin: 0, fontWeight: '500' }}>{basicInformation.age || "-"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-3 mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{ 
                          width: '28px',
                          height: '28px',
                          background: colors.light,
                          color: colors.primary
                        }}
                      >
                        <i className="bi bi-rulers"></i>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7 }}>Height</span>
                        <p style={{ margin: 0, fontWeight: '500' }}>
                          {basicInformation.height?.value || "-"} {basicInformation.height?.unit || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-3 mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{ 
                          width: '28px',
                          height: '28px',
                          background: colors.light,
                          color: colors.primary
                        }}
                      >
                        <i className="bi bi-speedometer"></i>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7 }}>Weight</span>
                        <p style={{ margin: 0, fontWeight: '500' }}>
                          {basicInformation.weight?.value || "-"} {basicInformation.weight?.unit || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-3 mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{ 
                          width: '28px',
                          height: '28px',
                          background: colors.light,
                          color: colors.primary
                        }}
                      >
                        <i className="bi bi-droplet"></i>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7 }}>Blood Type</span>
                        <p style={{ margin: 0, fontWeight: '500' }}>{basicInformation.bloodType || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Edit Profile Button */}
              <div className="ms-md-auto mt-3 mt-md-0">
                <button 
                  className="btn px-3 py-2 rounded-pill" 
                  style={{ 
                    background: 'white', 
                    color: colors.primary, 
                    border: `1px solid ${colors.primary}`,
                    fontSize: '0.9rem'
                  }}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;