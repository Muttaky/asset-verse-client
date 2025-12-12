import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaSync,
  FaClipboardList,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../useAuth";
import useAxiosSecure from "../useAxiosSecure";

const defaultHRProfile = {
  packageLimit: 0,
  companyName: "",
};

const Request = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [allRequests, setAllRequests] = useState([]);
  const [hrAffiliations, setHrAffiliations] = useState([]);
  const [hrProfile, setHrProfile] = useState(defaultHRProfile);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [submitting, setSubmitting] = useState(false);

  const currentEmployeeCount = hrAffiliations.length;
  const packageLimit = hrProfile.packageLimit;
  const isLimitReached =
    packageLimit > 0 && currentEmployeeCount >= packageLimit;

  const fetchHRData = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [usersRes, affiliationsRes, requestsRes] = await Promise.all([
        axiosSecure.get(`/users`),
        axiosSecure.get(`/affiliations`),
        axiosSecure.get(`/requests`),
      ]);

      const allUsers = usersRes.data;
      const allAffiliations = affiliationsRes.data;
      const allReqs = requestsRes.data;

      const currentUserProfile =
        allUsers.find((u) => u.email === user.email) || defaultHRProfile;
      const currentHRAffiliations = allAffiliations.filter(
        (aff) => aff.hrEmail === user.email
      );
      const hrRequests = allReqs.filter((r) => r.hrEmail === user.email);

      setHrProfile(currentUserProfile);
      setHrAffiliations(currentHRAffiliations);
      setAllRequests(hrRequests);
    } catch (error) {
      console.error("Error fetching HR dashboard data:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [user, axiosSecure]);

  useEffect(() => {
    fetchHRData();
  }, [fetchHRData]);

  const filteredRequests = allRequests.filter((request) => {
    if (filterStatus === "All") return true;
    return request.status === filterStatus;
  });

  const handleApprove = async (request) => {
    if (isLimitReached) {
      toast.error(
        `Cannot approve. Employee limit (${packageLimit}) reached. Upgrade your package.`
      );
      return;
    }
    if (request.status !== "pending") {
      toast.warn("This request has already been processed.");
      return;
    }

    setSubmitting(true);
    const today = new Date().toISOString().split("T")[0];

    try {
      const isAlreadyAffiliated = hrAffiliations.some(
        (aff) => aff.epEmail === request.epEmail
      );
      if (!isAlreadyAffiliated) {
        const newAffiliation = {
          epName: request.epName,
          epEmail: request.epEmail,
          hrEmail: user.email,
          hrPhoto: user.photoURL,
          affiliationDate: today,
          companyName: request.companyName,
          status: "active",
        };
        await axiosSecure.post("/affiliations", newAffiliation);
        setHrAffiliations([...hrAffiliations, newAffiliation]);
        toast.info(`New employee ${request.epName} affiliated successfully.`);
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
      await axiosSecure.post("/assigneds", newAssigned);

      const newRequestStatus = {
        status: "approved",
        approvalDate: today,
      };
      await axiosSecure.patch(`/requests/${request._id}`, newRequestStatus);

      toast.success(
        `Request for ${request.assetName} approved and asset assigned.`
      );
      await fetchHRData();
    } catch (error) {
      console.error("Approval error:", error);
      toast.error(
        "Approval failed due to a system error. Please check the network and API."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (request) => {
    if (request.status !== "pending") {
      toast.warn("This request has already been processed.");
      return;
    }
    setSubmitting(true);
    const today = new Date().toISOString().split("T")[0];

    const newStatus = {
      status: "rejected",
      rejectionDate: today,
    };

    try {
      await axiosSecure.patch(`/requests/${request._id}`, newStatus);
      toast.info(`Request for ${request.assetName} rejected.`);
      await fetchHRData();
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error("Rejection failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="badge badge-warning font-semibold flex items-center gap-1 text-white">
            <FaClock /> Pending
          </div>
        );
      case "approved":
        return (
          <div className="badge badge-success font-semibold flex items-center gap-1 text-white">
            <FaCheckCircle /> Approved
          </div>
        );
      case "rejected":
        return (
          <div className="badge badge-error font-semibold flex items-center gap-1 text-white">
            <FaTimesCircle /> Rejected
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
        <p className="text-xl text-gray-600">Loading Requests and HR Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
        <FaClipboardList className="text-primary" /> All Received Requests
      </h1>
      <p className="text-gray-500 mb-6">
        Review, approve, or reject employee requests for assets.
      </p>

      {isLimitReached && (
        <div className="alert alert-error mb-6">
          <FaExclamationTriangle className="w-6 h-6" />
          <div className="text-white">
            <h3 className="font-bold">Employee Limit Reached!</h3>
            <p className="text-sm">
              You have reached your package limit ({packageLimit} employees).
              Please{" "}
              <Link to="/pack" className="underline font-bold">
                upgrade your subscription
              </Link>{" "}
              to approve new employee requests.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-base-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 font-semibold text-base-content">
          <FaFilter className="text-primary" /> Filter by Status:
        </div>
        <div className="tabs tabs-boxed">
          {["All", "pending", "approved", "rejected"].map((status) => (
            <a
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`tab ${
                filterStatus === status
                  ? "tab-active bg-primary text-white"
                  : "hover:bg-primary/10"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </a>
          ))}
        </div>
        <button
          className="btn btn-ghost btn-circle text-primary"
          onClick={fetchHRData}
          disabled={loading || submitting}
          aria-label="Refresh Requests List"
        >
          <FaSync className={loading || submitting ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-primary">
            <tr>
              <th>Request ID</th>
              <th>Asset Name</th>
              <th>Employee</th>
              <th>Status</th>
              <th>Requested On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr
                  key={request._id}
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
                    {!hrAffiliations.some(
                      (aff) => aff.epEmail === request.epEmail
                    ) &&
                      request.status === "pending" && (
                        <div className="text-xs text-info mt-1 font-semibold">
                          (New Employee - Affiliation required)
                        </div>
                      )}
                  </td>
                  <td className="text-sm">{request.requestDate}</td>
                  <td className="space-x-2">
                    {request.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApprove(request)}
                          className="btn btn-sm btn-primary transition-transform hover:scale-105"
                          aria-label="Approve Request"
                          disabled={isLimitReached || submitting}
                        >
                          {submitting ? (
                            <FaSync className="animate-spin" />
                          ) : (
                            <FaCheckCircle />
                          )}{" "}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request)}
                          className="btn btn-sm btn-error btn-outline transition-transform hover:scale-105"
                          aria-label="Reject Request"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <FaSync className="animate-spin" />
                          ) : (
                            <FaTimesCircle />
                          )}{" "}
                          Reject
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-sm btn-ghost" disabled>
                        <FaCheckCircle /> Action Complete
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
