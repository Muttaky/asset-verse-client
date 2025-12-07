import React, { useState } from "react";
import { Link } from "react-router";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaFilter,
  FaSync,
  FaClipboardList,
} from "react-icons/fa";

// Placeholder Data for HR Manager's package status (MUST BE ENFORCED)
// In a real application, this would be fetched from a global Auth/HR Context.
const hrPackageStatus = {
  currentEmployees: 4, // Simulating 4 out of 5 slots used
  packageLimit: 5, // Default package limit
};

// Placeholder Data for Requests List (Simulating data fetched from a backend)
const initialRequests = [
  {
    id: 101,
    assetName: "MacBook Pro M3",
    employee: "Alice Johnson",
    email: "alice@company.com",
    status: "Pending",
    type: "Returnable",
    requestedOn: "2024-11-28",
    isFirstRequest: true,
  },
  {
    id: 102,
    assetName: "Office Desk Lamp",
    employee: "Bob Kellar",
    email: "bob@company.com",
    status: "Approved",
    type: "Returnable",
    requestedOn: "2024-11-25",
    isFirstRequest: false,
  },
  {
    id: 103,
    assetName: "Company T-Shirt (L)",
    employee: "Charlie Davis",
    email: "charlie@company.com",
    status: "Rejected",
    type: "Non-returnable",
    requestedOn: "2024-11-20",
    isFirstRequest: true,
  },
  {
    id: 104,
    assetName: "4K External Monitor",
    employee: "Diana Prince",
    email: "diana@company.com",
    status: "Pending",
    type: "Returnable",
    requestedOn: "2024-11-15",
    isFirstRequest: false,
  },
  {
    id: 105,
    assetName: "New Hire Emily",
    employee: "Emily Clark",
    email: "emily@company.com",
    status: "Pending",
    type: "Returnable",
    requestedOn: "2024-11-29",
    isFirstRequest: true,
  }, // This request will trigger the limit warning in this demo setup
];

const Request = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [requests, setRequests] = useState(initialRequests);

  // Filter requests based on selected status
  const filteredRequests = requests.filter((request) => {
    if (filterStatus === "All") return true;
    return request.status === filterStatus;
  });

  // --- Core HR Actions: Approval with Limit Enforcement & Auto-Affiliation ---
  const handleApprove = (id) => {
    const request = requests.find((r) => r.id === id);
    if (!request || request.status !== "Pending") return;

    // 1. Package Limit Enforcement: Block approval if new employee will exceed limit
    if (
      request.isFirstRequest &&
      hrPackageStatus.currentEmployees >= hrPackageStatus.packageLimit
    ) {
      alert(
        `ACTION BLOCKED: Cannot approve this request. Approving ${request.employee} would exceed your current package limit of ${hrPackageStatus.packageLimit} employees. Please upgrade your package first.`
      );
      return;
    }

    // 2. Auto-Affiliation Logic (if first request)
    if (request.isFirstRequest) {
      console.log(
        `Approving request ${id}. Auto-affiliating Employee ${request.employee}.`
      );
      // In a real app, the backend would handle the affiliation and increment the count.
      // hrPackageStatus.currentEmployees++; // Placeholder: Increment employee count
    } else {
      console.log(
        `Approving request ${id}. Assigning asset to already affiliated employee.`
      );
    }

    // Update the request status in state (simulating successful backend update)
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
    alert(`Request for ${request.assetName} approved!`);
  };

  const handleReject = (id) => {
    const request = requests.find((r) => r.id === id);
    if (!request || request.status !== "Pending") return;

    // Update the request status in state (simulating backend update)
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
    alert(`Request for ${request.assetName} rejected.`);
  };

  // Helper function to get DaisyUI classes based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <div className="badge badge-warning font-semibold flex items-center gap-1">
            <FaClock /> Pending
          </div>
        );
      case "Approved":
        return (
          <div className="badge badge-success font-semibold flex items-center gap-1">
            <FaCheckCircle /> Approved
          </div>
        );
      case "Rejected":
        return (
          <div className="badge badge-error font-semibold flex items-center gap-1">
            <FaTimesCircle /> Rejected
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
        <FaClipboardList className="text-primary" /> All Received Requests
      </h1>
      <p className="text-gray-500 mb-6">
        Review, approve, or reject employee requests for assets.
      </p>

      {/* Control Panel: Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-base-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 font-semibold text-base-content">
          <FaFilter className="text-primary" /> Filter by Status:
        </div>

        <div className="tabs tabs-boxed">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <a
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`tab ${
                filterStatus === status
                  ? "tab-active bg-primary text-white"
                  : "hover:bg-primary/10"
              }`}
            >
              {status}
            </a>
          ))}
        </div>

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
          <thead className="bg-base-200 text-primary">
            <tr>
              <th className="font-semibold text-base">Request ID</th>
              <th className="font-semibold text-base">Asset Name</th>
              <th className="font-semibold text-base">Employee</th>
              <th className="font-semibold text-base">Status</th>
              <th className="font-semibold text-base">Requested On</th>
              <th className="font-semibold text-base">Actions</th>
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
                  <td className="font-mono text-xs text-gray-500">
                    {request.id}
                  </td>
                  <td className="font-medium text-base-content">
                    {request.assetName}
                  </td>
                  <td>
                    <div className="font-bold">{request.employee}</div>
                    <div className="text-sm opacity-50">{request.email}</div>
                  </td>
                  <td>
                    {getStatusBadge(request.status)}
                    {request.isFirstRequest && request.status === "Pending" && (
                      <div className="text-xs text-info mt-1 font-semibold">
                        (First Request - Affiliation required)
                      </div>
                    )}
                  </td>
                  <td className="text-sm">{request.requestedOn}</td>
                  <td className="space-x-2">
                    {request.status === "Pending" ? (
                      <>
                        {/* Approve Button (Primary color) */}
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="btn btn-sm btn-primary transition-transform hover:scale-105"
                          aria-label="Approve Request"
                        >
                          Approve
                        </button>
                        {/* Reject Button (Secondary/Error color) */}
                        <button
                          onClick={() => handleReject(request.id)}
                          className="btn btn-sm btn-error btn-outline transition-transform hover:scale-105"
                          aria-label="Reject Request"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-sm btn-ghost" disabled>
                        <FaEye /> View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-lg text-gray-500"
                >
                  No {filterStatus.toLowerCase()} requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Request;
