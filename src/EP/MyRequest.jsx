import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaSync,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../useAuth";
import useAxiosSecure from "../useAxiosSecure";

const MyRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [employeeRequests, setEmployeeRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchMyRequests = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const requestsRes = await axiosSecure.get(`/requests`);
      const allRequests = requestsRes.data;
      const filtered = allRequests.filter((r) => r.epEmail === user.email);
      setEmployeeRequests(filtered);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load your requests.");
    } finally {
      setLoading(false);
    }
  }, [user, axiosSecure]);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const filteredRequests = employeeRequests.filter((request) =>
    request.assetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancelRequest = async (request) => {
    const { _id, assetName, status } = request;
    if (status !== "pending") {
      toast.warn(
        `Cannot cancel the request for ${assetName} as its status is ${status}.`
      );
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to cancel your request for "${assetName}"?`
      )
    ) {
      return;
    }
    setSubmitting(true);
    const newStatus = {
      status: "cancelled",
      cancellationDate: new Date().toISOString().split("T")[0],
    };
    try {
      const response = await axiosSecure.patch(`/requests/${_id}`, newStatus);
      if (response.data.modifiedCount > 0) {
        toast.success(`Request for ${assetName} has been cancelled.`);
        await fetchMyRequests();
      } else {
        toast.error("Failed to cancel request on the server.");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("An error occurred during cancellation.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="badge badge-warning text-white font-semibold flex items-center gap-1">
            <FaClock />
            Pending
          </div>
        );
      case "approved":
        return (
          <div className="badge badge-success text-white font-semibold flex items-center gap-1">
            <FaCheckCircle />
            Approved
          </div>
        );
      case "rejected":
        return (
          <div className="badge badge-error text-white font-semibold flex items-center gap-1">
            <FaTimesCircle />
            Rejected
          </div>
        );
      case "cancelled":
        return (
          <div className="badge badge-neutral font-semibold flex items-center gap-1">
            <FaTrash />
            Cancelled
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <FaSync className="animate-spin text-primary text-4xl mr-3" />
        <p className="text-xl text-gray-600">Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
        <FaClipboardList className="text-secondary" />
        My Requested Assets
      </h1>
      <p className="text-gray-500 mb-6">
        Track the status of all asset requests you have submitted to HR.
      </p>

      <div className="flex justify-between items-center mb-6">
        <div className="form-control w-full md:w-1/3">
          <label className="input input-bordered flex items-center gap-2 bg-base-200">
            <FaSearch className="h-4 w-4 opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Search requested asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        <button
          className="btn btn-ghost btn-circle text-primary"
          onClick={fetchMyRequests}
          disabled={loading || submitting}
        >
          <FaSync className={loading || submitting ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-secondary">
            <tr>
              <th className="font-semibold text-base">Asset Name</th>
              <th className="font-semibold text-base">Type</th>
              <th className="font-semibold text-base">Requested On</th>
              <th className="font-semibold text-base">Status</th>
              <th className="font-semibold text-base text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr
                  key={request._id}
                  className="hover:bg-base-200/50 transition-colors duration-150"
                >
                  <td className="font-bold">{request.assetName}</td>
                  <td>
                    <div
                      className={`badge ${
                        request.assetType?.toLowerCase() === "returnable"
                          ? "badge-info"
                          : "badge-secondary"
                      } text-white font-medium`}
                    >
                      {request.assetType}
                    </div>
                  </td>
                  <td className="text-sm opacity-80">{request.requestDate}</td>
                  <td>{getStatusBadge(request.status)}</td>

                  <td className="text-center">
                    {request.status === "pending" ? (
                      <button
                        onClick={() => handleCancelRequest(request)}
                        className="btn btn-sm btn-error btn-outline transition-transform hover:scale-105"
                        aria-label="Cancel Request"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <FaSync className="animate-spin" />
                        ) : (
                          <FaTrash className="w-4 h-4" />
                        )}
                        Cancel
                      </button>
                    ) : (
                      <div className="text-gray-400 text-sm">
                        No action available
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-lg text-gray-500"
                >
                  You have not submitted any requests yet. Browse the{" "}
                  <Link to="/assets" className="link link-primary">
                    Assets page
                  </Link>{" "}
                  to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRequest;
