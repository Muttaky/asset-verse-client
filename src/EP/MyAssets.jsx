import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import {
  FaLaptop,
  FaChair,
  FaTshirt,
  FaUndo,
  FaTag,
  FaCheckCircle,
  FaSearch,
  FaUserTag,
  FaClock,
  FaSync,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../useAuth";
import useAxiosSecure from "../useAxiosSecure";

const MyAssets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignedAssets = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axiosSecure.get(`/assigneds?email=${user.email}`);
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assigned assets:", error);
      toast.error("Failed to load your assigned assets.");
    } finally {
      setLoading(false);
    }
  }, [user, axiosSecure]);

  useEffect(() => {
    fetchAssignedAssets();
  }, [fetchAssignedAssets]);

  const filteredAssets = assets.filter((asset) =>
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInitiateReturn = async (asset) => {
    if (asset.assetType !== "returnable" || asset.status === "Return Pending")
      return;

    if (
      !window.confirm(
        `Are you sure you want to initiate the return process for "${asset.assetName}"? HR will be notified.`
      )
    ) {
      return;
    }

    setSubmitting(true);

    const returnRequest = {
      assignedAssetId: asset._id,
      assetId: asset.assetId,
      assetName: asset.assetName,
      assetType: asset.assetType,
      epEmail: user.email,
      hrEmail: asset.hrEmail,
      requestDate: new Date().toISOString().split("T")[0],
      returnStatus: "Return Pending",
    };

    try {
      const returnRes = await axiosSecure.post("/returns", returnRequest);

      if (returnRes.data.insertedId) {
        toast.success(
          `Return request for ${asset.assetName} submitted successfully.`
        );
        setAssets(
          assets.map((a) =>
            a._id === asset._id ? { ...a, status: "Return Pending" } : a
          )
        );
      } else {
        toast.error("Return submission failed on the server.");
      }
    } catch (error) {
      console.error("API Error during return initiation:", error);
      toast.error("An error occurred while submitting the return request.");
    } finally {
      setSubmitting(false);
    }
  };

  const getAssetIcon = (name) => {
    if (
      name.toLowerCase().includes("macbook") ||
      name.toLowerCase().includes("laptop") ||
      name.toLowerCase().includes("pc")
    )
      return FaLaptop;
    if (
      name.toLowerCase().includes("chair") ||
      name.toLowerCase().includes("desk")
    )
      return FaChair;
    if (
      name.toLowerCase().includes("t-shirt") ||
      name.toLowerCase().includes("swag") ||
      name.toLowerCase().includes("hoodie")
    )
      return FaTshirt;
    return FaTag;
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <FaSync className="animate-spin text-primary text-4xl mr-3" />
        <p className="text-xl text-gray-600">Loading your assigned assets...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
        <FaUserTag className="text-secondary" /> My Assigned Assets
      </h1>

      <p className="text-gray-500 mb-6">
        A list of all equipment currently assigned to you by the company.
      </p>

      <div className="flex justify-between items-center mb-6">
        <div className="form-control w-full md:w-1/3">
          <label className="input input-bordered flex items-center gap-2 bg-base-200">
            <FaSearch className="h-4 w-4 opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-secondary">
            <tr>
              <th className="font-semibold text-base">Asset</th>
              <th className="font-semibold text-base">Serial / Identifier</th>
              <th className="font-semibold text-base">Type</th>
              <th className="font-semibold text-base">Assigned On</th>
              <th className="font-semibold text-base text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => {
                const Icon = getAssetIcon(asset.assetName);
                const isReturning = asset.status === "Return Pending";

                return (
                  <tr
                    key={asset._id}
                    className="hover:bg-base-200/50 transition-colors duration-150"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="font-bold">{asset.assetName}</div>
                      </div>
                    </td>

                    <td className="font-mono text-xs opacity-50">
                      {asset.assetId}
                    </td>

                    <td>
                      <div
                        className={`badge ${
                          asset.assetType === "returnable"
                            ? "badge-info"
                            : "badge-secondary"
                        } text-white font-medium`}
                      >
                        {asset.assetType}
                      </div>
                    </td>

                    <td className="text-sm">{asset.assignmentDate}</td>

                    <td className="text-center">
                      {asset.assetType === "returnable" ? (
                        <button
                          onClick={() => handleInitiateReturn(asset)}
                          className={`btn btn-sm ${
                            isReturning
                              ? "btn-warning"
                              : "btn-outline btn-primary"
                          }`}
                          disabled={isReturning || submitting}
                        >
                          {isReturning ? (
                            <>
                              <FaClock /> Pending HR Action
                            </>
                          ) : (
                            <>
                              {submitting ? (
                                <FaSync className="animate-spin" />
                              ) : (
                                <FaUndo />
                              )}
                              Initiate Return
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-success flex items-center justify-center font-semibold">
                          <FaCheckCircle className="mr-1" /> Permanent Asset
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-lg text-gray-500"
                >
                  You currently have no assets assigned. Check the{" "}
                  <Link to="/assets" className="link link-primary">
                    Assets page
                  </Link>{" "}
                  to submit a request.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAssets;
