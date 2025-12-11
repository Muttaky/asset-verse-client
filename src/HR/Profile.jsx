import React, { useState } from "react";
import {
  FaUserCircle,
  FaEdit,
  FaSave,
  FaBuilding,
  FaEnvelope,
  FaTag,
  FaSync,
} from "react-icons/fa";
import { Link } from "react-router";
import useAuth from "../useAuth";

// Placeholder data for the HR Manager's profile and company status

const Profile = () => {
  let { users, user, affiliations } = useAuth();
  let myAff = affiliations.filter((a) => a.hrEmail === user.email);
  let currentEP = myAff.length;
  let currentUser = users.find((u) => u.email === user.email);
  const initialProfile = currentUser;
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
    console.log("Updating Profile:", formData);

    setTimeout(() => {
      setProfile(formData);
      setIsEditing(false);
      setLoading(false);
      alert("Profile updated successfully!");
    }, 1500);
  };

  const employeeStatusColor =
    profile.employeeCount >= profile.employeeLimit
      ? "bg-error text-white"
      : "bg-success text-white";

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
        <FaUserCircle className="text-primary" /> HR Manager Profile
      </h1>
      <p className="text-gray-500 mb-6">
        View and update your personal and company details.
      </p>

      <div className="card bg-base-100 shadow-2xl p-6 md:p-10 max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Profile Picture and Summary */}
          <div className="lg:w-1/3 flex flex-col items-center border-b lg:border-r lg:border-b-0 border-base-200 pb-6 lg:pb-0 lg:pr-6">
            <div className="avatar mb-4">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL} alt={`${user.displayName} profile`} />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-1">{user.displayName}</h2>
            <p className="text-sm text-gray-500 mb-4">HR Manager</p>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn btn-sm ${
                isEditing ? "btn-secondary" : "btn-primary btn-outline"
              } w-full max-w-xs`}
            >
              <FaEdit /> {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>

            <div className="divider my-4 w-1/2"></div>

            {/* Package Status Card */}
            <div
              className={`card shadow-lg w-full max-w-xs p-4 text-center ${employeeStatusColor}`}
            >
              <div className="font-bold text-lg mb-1">
                {profile.subscribtion} Package
              </div>
              <div className="text-sm">
                {currentEP} / {profile.packageLimit} Employee Slots Used
              </div>
              {profile.employeeCount >= profile.employeeLimit && (
                <Link
                  to="/upgrade-package"
                  className="btn btn-sm btn-warning mt-3"
                >
                  Upgrade Now
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Details/Form */}
          <div className="lg:w-2/3">
            <h3 className="text-2xl font-semibold text-primary mb-6">
              {isEditing ? "Update Details" : "Account Details"}
            </h3>

            <form onSubmit={handleUpdate}>
              {/* Company Details (View Only in this section) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ProfileDetail
                  label="Company Name"
                  value={profile.companyName}
                  icon={FaBuilding}
                />
                <ProfileDetail
                  label="Current Package"
                  value={profile.subscribtion}
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
                    disabled={!isEditing}
                    className={`input input-bordered w-full ${
                      isEditing ? "input-primary" : "bg-base-200"
                    }`}
                    required
                  />
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
    <Icon className="h-6 w-6 text-secondary mr-3 flex-shrink-0" />
    <div>
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="text-base font-medium text-base-content">{value}</div>
    </div>
  </div>
);

export default Profile;
