import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEdit,
  FaSave,
  FaBuilding,
  FaTag,
  FaSync,
} from "react-icons/fa";
import { Link } from "react-router";
import useAuth from "../useAuth";
import useAxiosSecure from "../useAxiosSecure";

const defaultProfile = {
  name: "Loading...",
  email: "",
  companyName: "N/A",
  createdAt: "N/A",
  packageLimit: 0,
  employeeLimit: 0,
};

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(defaultProfile);
  const [currentEP, setCurrentEP] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!user?.email) {
      setInitialLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const usersResponse = await axiosSecure.get(`/users`);
        const allUsers = usersResponse.data;

        const affResponse = await axiosSecure.get(`/affiliations`);
        const allAffiliations = affResponse.data;

        const currentUserData = allUsers.find((u) => u.email === user.email);

        if (currentUserData) {
          const employeeCount = allAffiliations.filter(
            (a) => a.hrEmail === user.email
          ).length;

          setProfile({
            ...currentUserData,
            packageLimit: currentUserData.packageLimit || 0,
            employeeLimit: currentUserData.employeeLimit || 0,
          });

          setCurrentEP(employeeCount);
          setFormData(currentUserData);
        } else {
          setProfile({
            ...defaultProfile,
            name: user.displayName,
            email: user.email,
          });

          setFormData({
            ...defaultProfile,
            name: user.displayName,
            email: user.email,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfileData();
  }, [user, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const updatedFields = {
        name: formData.name,
        email: formData.email,
      };

      await axiosSecure.put(`/users/${user.email}`, updatedFields);

      setProfile((prev) => ({ ...prev, ...updatedFields }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) setFormData(profile);
    setIsEditing(!isEditing);
  };

  if (initialLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-3 text-lg text-gray-600">Loading Profile Data...</p>
      </div>
    );
  }

  const employeeStatusColor =
    currentEP >= profile.packageLimit
      ? "bg-error text-white"
      : "bg-success text-white";

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
        <FaUserCircle className="text-primary" />
        HR Manager Profile
      </h1>

      <p className="text-gray-500 mb-6">
        View and update your personal and company details.
      </p>

      <div className="card bg-base-100 shadow-2xl p-6 md:p-10 max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-1/3 flex flex-col items-center border-b lg:border-r lg:border-b-0 border-base-200 pb-6 lg:pb-0 lg:pr-6">
            <div className="avatar mb-4">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL} alt={user.displayName} />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
            <p className="text-sm text-gray-500 mb-4">HR Manager</p>

            <button
              onClick={toggleEdit}
              className={`btn btn-sm ${
                isEditing ? "btn-secondary" : "btn-primary btn-outline"
              } w-full max-w-xs`}
            >
              <FaEdit />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>

            <div className="divider my-4 w-1/2"></div>

            {/* Package Status */}
            <div
              className={`card shadow-lg w-full max-w-xs p-4 text-center ${employeeStatusColor}`}
            >
              <div className="font-bold text-lg mb-1">Subscription Package</div>
              <div className="text-sm">
                {currentEP} / {profile.packageLimit} Employee Slots Used
              </div>

              {currentEP >= profile.packageLimit && (
                <Link
                  to="/upgrade-package"
                  className="btn btn-sm btn-warning mt-3"
                >
                  Upgrade Now
                </Link>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-2/3">
            <h3 className="text-2xl font-semibold text-primary mb-6">
              {isEditing ? "Update Details" : "Account Details"}
            </h3>

            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ProfileDetail
                  label="Company Name"
                  value={profile.companyName}
                  icon={FaBuilding}
                />
                <ProfileDetail
                  label="Created At"
                  value={profile.createdAt}
                  icon={FaTag}
                />
              </div>

              <div className="divider">Personal Information</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={isEditing ? formData.name : profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input input-bordered w-full ${
                      isEditing ? "input-primary" : "bg-base-200"
                    }`}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled={true}
                    className="input input-bordered w-full bg-base-200"
                    required
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-control mt-8">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg font-bold transition-transform duration-300 hover:scale-[1.01]"
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <>
                        <FaSync className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
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

const ProfileDetail = ({ label, value, icon: Icon }) => (
  <div className="flex items-center p-3 bg-base-200 rounded-lg shadow-sm">
    <Icon className="h-6 w-6 text-secondary mr-3" />
    <div>
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="text-base font-medium text-base-content">{value}</div>
    </div>
  </div>
);

export default Profile;
