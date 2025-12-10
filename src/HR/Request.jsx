import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaFilter,
  FaSync,
  FaClipboardList,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../useAuth";
// Placeholder Data for HR Manager's package status (MUST BE ENFORCED)
// In a real application, this would be fetched from a global Auth/HR Context.

// Placeholder Data for Requests List (Simulating data fetched from a backend)

const Request = () => {
  let { user, affiliations, users } = useAuth();
  let myAff = affiliations.filter((aff) => aff.hrEmail === user.email);
  let currentUser = users.find((u) => u.email === user.email);
  const allRequests = useLoaderData();
  let initialRequests = allRequests.filter((r) => r.hrEmail === user.email);

  const [filterStatus, setFilterStatus] = useState("All");
  const [requests, setRequests] = useState(initialRequests);

  // Filter requests based on selected status
  const filteredRequests = requests.filter((request) => {
    if (filterStatus === "All") return true;
    return request.status === filterStatus;
  });

  // --- Core HR Actions: Approval with Limit Enforcement & Auto-Affiliation ---
  const handleApprove = async (request) => {
    let oldAff = myAff.find((aff) => aff.epEmail === request.epEmail);

    //DB start
    const today = new Date().toISOString().split("T")[0];

    if (oldAff) {
      console.log("already affiliated");
    } else {
      const newAffiliation = {
        epName: request.epName,
        epEmail: request.epEmail,
        hrEmail: user.email,
        hrPhoto: user.photoURL,
        affiliationDate: today,
        companyName: request.companyName,
        status: "active",
      };
      fetch("http://localhost:3000/affiliations", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newAffiliation),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("after post affiliation", data);
          if (data.insertedId) {
            toast("affiliation added successfully");
          }
        });
    }

    const newAssigned = {
      assetId: request.assetId,
      assetName: request.assetName,
      assetImage: request.assetImage,
      assetType: request.assetType,
      epName: request.epName,
      epEmail: request.epEmail,
      hrEmail: user.email,
      assignmentDate: today,
      companyName: request.companyName,
      status: "assigned",
    };
    fetch("http://localhost:3000/assigneds", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newAssigned),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("after post assigned", data);
        if (data.insertedId) {
          toast("assigned added successfully");
        }
      });

    const newStatus = {
      assetId: request.assetId,
      assetName: request.assetName,
      assetType: request.assetType,
      requestDate: request.requestDate,
      companyName: request.companyName,
      epName: request.epName,
      epEmail: request.epEmail,
      hrEmail: request.hrEmail,
      status: "approved",
      approvalDate: request.approvalDate,
    };

    try {
      let response = await fetch(
        `http://localhost:3000/requests/${request._id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(newStatus),
        }
      );
      let data = await response.json();
      if (data.modifiedCount) {
        toast(`Request for ${request.assetName} approved.`);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to update.", error);
    }
  };

  const handleReject = async (request) => {
    const newStatus = {
      assetId: request.assetId,
      assetName: request.assetName,
      assetType: request.assetType,
      requestDate: request.requestDate,
      companyName: request.companyName,
      epName: request.epName,
      epEmail: request.epEmail,
      hrEmail: request.hrEmail,
      status: "rejected",
      approvalDate: request.approvalDate,
    };

    try {
      let response = await fetch(
        `http://localhost:3000/requests/${request._id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(newStatus),
        }
      );
      let data = await response.json();
      if (data.modifiedCount) {
        toast(`Request for ${request.assetName} rejected.`);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to update.", error);
    }
  };

  // Helper function to get DaisyUI classes based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="badge badge-warning font-semibold flex items-center gap-1">
            <FaClock /> Pending
          </div>
        );
      case "approved":
        return (
          <div className="badge badge-success font-semibold flex items-center gap-1">
            <FaCheckCircle /> Approved
          </div>
        );
      case "rejected":
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
                    {request._id}
                  </td>
                  <td className="font-medium text-base-content">
                    {request.assetName}
                  </td>
                  <td>
                    <div className="font-bold">{request.epName}</div>
                    <div className="text-sm opacity-50">{request.epEmail}</div>
                  </td>
                  <td>
                    {getStatusBadge(request.status)}
                    {request.isFirstRequest && request.status === "pending" && (
                      <div className="text-xs text-info mt-1 font-semibold">
                        (First Request - Affiliation required)
                      </div>
                    )}
                  </td>
                  <td className="text-sm">{request.requestDate}</td>
                  <td className="space-x-2">
                    {request.status === "pending" ? (
                      <>
                        {/* Approve Button (Primary color) */}
                        {currentUser.packageLimit <= myAff.length ? (
                          <Link to="/pack">
                            <button
                              className="btn btn-sm btn-primary transition-transform hover:scale-105"
                              aria-label="Approve Request"
                            >
                              Approve
                            </button>
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleApprove(request)}
                            className="btn btn-sm btn-primary transition-transform hover:scale-105"
                            aria-label="Approve Request"
                          >
                            Approve
                          </button>
                        )}

                        {/* Reject Button (Secondary/Error color) */}
                        <button
                          onClick={() => handleReject(request)}
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
