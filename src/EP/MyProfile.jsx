import React, { useState } from "react";
// Fixed: Ensure all icons are imported
import {
  FaUserCircle,
  FaEdit,
  FaSave,
  FaBuilding,
  FaEnvelope,
  FaTag,
  FaSync,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router";
import useAuth from "../useAuth";

// Placeholder data for the Employee's profile and company status

const MyProfile = () => {
  let { user, affiliations } = useAuth();

  let myAff = affiliations.find((u) => u.epEmail === user.email);
  const initialProfile = myAff;
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialProfile);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);

    // --- API Call Simulation ---
    console.log("Updating Employee Profile:", formData);

    setTimeout(() => {
      setProfile(formData);
      setIsEditing(false);
      setLoading(false);
      alert("Profile updated successfully!");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
        <FaUserCircle className="text-secondary" /> My Profile
      </h1>
      <p className="text-gray-500 mb-6">
        Review and update your personal details and company affiliation.
      </p>

      <div className="card bg-base-100 shadow-2xl p-6 md:p-10 max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Profile Picture and Summary */}
          <div className="lg:w-1/3 flex flex-col items-center border-b lg:border-r lg:border-b-0 border-base-200 pb-6 lg:pb-0 lg:pr-6">
            <div className="avatar mb-4">
              <div className="w-32 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL} alt={`${profile.name} profile`} />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-1">{user.displayName}</h2>
            <p className="text-sm text-gray-500 mb-4">{profile.employeeId}</p>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn btn-sm ${
                isEditing ? "btn-secondary" : "btn-primary btn-outline"
              } w-full max-w-xs`}
            >
              <FaEdit /> {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>

            <div className="divider my-4 w-1/2"></div>

            {/* Quick Stats Card */}
            <div
              className={`card shadow-lg w-full max-w-xs p-4 text-center bg-base-200 border-t-4 border-info`}
            >
              <div className="font-bold text-lg mb-1 flex items-center justify-center gap-2 text-info">
                <FaTag /> {profile.assignedAssets} Assets Assigned
              </div>
              <Link
                to="/my-assets"
                className="btn btn-sm btn-info btn-outline mt-3"
              >
                View My Assets
              </Link>
            </div>
          </div>

          {/* Right Column: Details/Form */}
          <div className="lg:w-2/3">
            <h3 className="text-2xl font-semibold text-secondary mb-6">
              {isEditing ? "Update Personal Details" : "Affiliation Details"}
            </h3>

            <form onSubmit={handleUpdate}>
              {/* Company and Team Details (View Only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ProfileDetail
                  label="Affiliated Company"
                  value={profile.companyName}
                  icon={FaBuilding}
                />
                <ProfileDetail
                  label="Current Team"
                  value={profile.team}
                  icon={FaUsers}
                />
                <ProfileDetail
                  label="Affiliation Date"
                  value={profile.affiliationDate}
                  icon={FaCheckCircle}
                />
                <ProfileDetail
                  label="Employee ID"
                  value={profile._id}
                  icon={FaTag}
                />
              </div>

              <div className="divider">Personal Information</div>

              {/* Personal Details (Editable or View) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={user.displayName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input input-bordered w-full ${
                      isEditing ? "input-primary" : "bg-base-200"
                    }`}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    disabled={true} // Email is usually non-editable
                    className={`input input-bordered w-full bg-base-300`}
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Email address is non-editable.
                    </span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="form-control mt-8">
                  <button
                    type="submit"
                    className={`btn btn-primary btn-lg font-bold transition-transform duration-300 hover:scale-[1.01]`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSync className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable component for displaying profile details
const ProfileDetail = ({ label, value, icon: Icon }) => (
  <div className="flex items-center p-3 bg-base-200 rounded-lg shadow-sm">
    <Icon className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
    <div>
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="text-base font-medium text-base-content">{value}</div>
    </div>
  </div>
);

export default MyProfile;
