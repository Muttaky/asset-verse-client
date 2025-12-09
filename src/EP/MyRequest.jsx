import React, { useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaSync,
  FaSearch,
} from "react-icons/fa";

// Placeholder Data for Employee's Asset Requests

const MyRequest = () => {
  const initialRequests = useLoaderData();
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = requests.filter((request) =>
    request.assetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Employee Action: Cancel Pending Request ---
  const handleCancelRequest = (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to cancel your request for "${name}"?`
      )
    ) {
      // --- Placeholder for API Call to Cancel Request ---
      console.log(`Cancelling request ID: ${id}`);

      // Update state to remove the request (simulated)
      setRequests(requests.filter((r) => r.id !== id));
      alert(`Request for ${name} has been cancelled.`);
    }
  };

  // Helper function to get DaisyUI classes and icon based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="badge badge-warning text-white font-semibold flex items-center gap-1">
            <FaClock /> Pending
          </div>
        );
      case "approved":
        return (
          <div className="badge badge-success text-white font-semibold flex items-center gap-1">
            <FaCheckCircle /> Approved
          </div>
        );
      case "rejected":
        return (
          <div className="badge badge-error text-white font-semibold flex items-center gap-1">
            <FaTimesCircle /> Rejected
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
        <FaClipboardList className="text-secondary" /> My Requested Assets
      </h1>
      <p className="text-gray-500 mb-6">
        Track the status of all asset requests you have submitted to HR.
      </p>

      {/* Control Panel: Search */}
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
        {/* Placeholder refresh button */}
        <button
          className="btn btn-ghost btn-circle text-primary"
          onClick={() => setRequests(initialRequests)}
        >
          <FaSync />
        </button>
      </div>

      {/* Requests Table (Responsive) */}
      <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          {/* Table Header */}
          <thead className="bg-base-200 text-secondary">
            <tr>
              <th className="font-semibold text-base">Asset Name</th>
              <th className="font-semibold text-base">Type</th>
              <th className="font-semibold text-base">Requested On</th>
              <th className="font-semibold text-base">Status</th>
              <th className="font-semibold text-base text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-base-200/50 transition-colors duration-150"
                >
                  <td className="font-bold">{request.assetName}</td>
                  <td>
                    <div
                      className={`badge ${
                        request.assetType === "Returnable"
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
                      >
                        <FaTrash className="w-4 h-4" /> Cancel
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
