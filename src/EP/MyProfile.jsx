import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
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
  FaIdCard,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../useAuth";
import useAxiosSecure from "../useAxiosSecure";

const ProfileDetail = ({ label, value, icon: Icon }) => (
  <div className="flex items-center p-3 bg-base-200 rounded-lg shadow-sm">
    <Icon className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
    <div>
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="text-base font-medium text-base-content">
        {value || "N/A"}
      </div>
    </div>
  </div>
);

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfileData = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosSecure.get(
        `/affiliations?epEmail=${user.email}`
      );
      const myAffiliation = response.data[0];

      if (myAffiliation) {
        setProfile(myAffiliation);
        setFormData(myAffiliation);
      } else {
        const fallbackData = {
          epEmail: user.email,
          name: user.displayName,
          companyName: "Unaffiliated",
          team: "N/A",
          affiliationDate: "N/A",
          assignedAssets: 0,
        };
        setProfile(fallbackData);
        setFormData(fallbackData);
        toast.warn(
          "No company affiliation record found. Data may be incomplete."
        );
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  }, [user, axiosSecure]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!profile?._id) {
      toast.error("Cannot update: Profile ID is missing.");
      setSaving(false);
      return;
    }

    const updateData = {
      name: formData.name,
    };

    try {
      const response = await axiosSecure.patch(
        `/affiliations/${profile._id}`,
        updateData
      );

      if (response.data.modifiedCount > 0 || response.data.acknowledged) {
        setProfile((prev) => ({ ...prev, ...updateData }));
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.warn("No changes were saved, or the update failed.");
      }
    } catch (error) {
      console.error("API Error during profile update:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <FaSync className="animate-spin text-primary text-4xl mr-3" />
        <p className="text-xl text-gray-600">Loading profile data...</p>
      </div>
    );
  }

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
          {/* Left Column */}
          <div className="lg:w-1/3 flex flex-col items-center border-b lg:border-r lg:border-b-0 border-base-200 pb-6 lg:pb-0 lg:pr-6">
            <div className="avatar mb-4">
              <div className="w-32 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL} alt={`${profile.name} profile`} />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-1">{user.displayName}</h2>

            <p classname="text-sm text-gray-500 mb-4 font-mono">
              ID: {profile._id || "N/A"}
            </p>

            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) setFormData(profile);
              }}
              className={`btn btn-sm ${
                isEditing ? "btn-secondary" : "btn-primary btn-outline"
              } w-full max-w-xs`}
            >
              <FaEdit />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>

            <div className="divider my-4 w-1/2"></div>

            <div className="card shadow-lg w-full max-w-xs p-4 text-center bg-base-200 border-t-4 border-info">
              <div className="font-bold text-lg mb-1 flex items-center justify-center gap-2 text-info">
                <FaTag /> {profile.assignedAssets || 0} Assets Assigned
              </div>

              <Link
                to="/my-assets"
                className="btn btn-sm btn-info btn-outline mt-3"
              >
                View My Assets
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-2/3">
            <h3 className="text-2xl font-semibold text-secondary mb-6">
              {isEditing ? "Update Personal Details" : "Affiliation Details"}
            </h3>

            <form onSubmit={handleUpdate}>
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
                  label="Affiliation ID (DB Ref)"
                  value={profile._id}
                  icon={FaIdCard}
                />
              </div>

              <div className="divider">Personal Information</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || user.displayName || ""}
                    onChange={handleChange}
                    disabled={!isEditing || saving}
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
                    value={user.email}
                    disabled
                    className="input input-bordered w-full bg-base-300"
                  />
                  <label className="label">
                    <span className="label-text-alt flex items-center gap-1">
                      <FaEnvelope className="text-sm" /> Email address is
                      non-editable.
                    </span>
                  </label>
                </div>
              </div>

              {isEditing && (
                <div className="form-control mt-8">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg font-bold transition-transform duration-300 hover:scale-[1.01]"
                    disabled={saving}
                  >
                    {saving ? (
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

export default MyProfile;
