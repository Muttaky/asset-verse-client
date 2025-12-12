import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaBoxes, FaUserTag, FaClipboardList } from "react-icons/fa";
import useAuth from "../useAuth";
import useAxiosSecure from "../useAxiosSecure";

// Placeholder data for Employee context

const EPdash = () => {
  let { user } = useAuth();

  let axiosSecure = useAxiosSecure();

  let [users, setUsers] = useState([]);
  useEffect(() => {
    axiosSecure(`/users`).then((data) => {
      setUsers(data.data);
    });
  }, []);
  let [assigneds, setAssigneds] = useState([]);
  useEffect(() => {
    axiosSecure(`/assigneds`).then((data) => {
      setAssigneds(data.data);
    });
  }, []);
  let [requests, setRequests] = useState([]);
  useEffect(() => {
    axiosSecure(`/requests`).then((data) => {
      setRequests(data.data);
    });
  }, []);

  const [asseti, setAssets] = useState([]);

  useEffect(() => {
    axiosSecure("http://localhost:3000/assets").then((data) =>
      setAssets(data.data.result)
    );
  }, []);
  let assets = asseti;

  let asset = assets.length;
  let myAssi = assigneds.filter((a) => a.epEmail === user.email);
  let myRequ = requests.filter(
    (a) => a.epEmail === user.email && a.status === "pending"
  );
  let requ = myRequ.length;
  let myAssin = myAssi.length;
  const employeeInfo = users.find((u) => u.email === user.email);
  // Removed: navLinks definition
  // Removed: handleLogout function
  // Removed: SidebarContent definition

  return (
    // Using a standard div to hold the main content, removing the Drawer
    <div className="min-h-screen bg-base-200">
      {/* Page Content: EMPLOYEE DASHBOARD HOME (Overview) */}
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-4xl font-bold text-secondary mb-6">
          Welcome, {user.displayName}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Quick overview of your assigned assets and requests.
        </p>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat shadow-lg bg-primary text-primary-content border-l-4 border-primary">
            <div className="stat-figure text-primary-content">
              <FaUserTag className="w-6 h-6" />
            </div>
            <div className="stat-title text-primary-content opacity-70">
              Assets Assigned
            </div>
            <div className="stat-value text-3xl">{myAssin}</div>
            <div className="stat-desc text-primary-content opacity-90">
              <Link to="/my-assets" className="underline hover:no-underline">
                View My Assets
              </Link>
            </div>
          </div>

          <div className="stat shadow-lg bg-base-100 border-l-4 border-secondary">
            <div className="stat-figure text-secondary">
              <FaClipboardList className="w-6 h-6" />
            </div>
            <div className="stat-title">Pending Requests</div>
            <div className="stat-value text-secondary">{requ}</div>
            <div className="stat-desc">
              <Link to="/my-request" className="link link-hover text-secondary">
                Track Requests
              </Link>
            </div>
          </div>

          <div className="stat shadow-lg bg-base-100 border-l-4 border-info">
            <div className="stat-figure text-info">
              <FaBoxes className="w-6 h-6" />
            </div>
            <div className="stat-title">Available Inventory</div>
            <div className="stat-value text-info">{asset}=items</div>
            <div className="stat-desc">
              <Link to="/assets" className="link link-hover text-info">
                Browse Inventory
              </Link>
            </div>
          </div>
        </div>

        {/* Placeholder for Recent Activity/Announcements */}
        <div className="card bg-base-100 shadow-xl p-6">
          <h3 className="card-title text-primary">
            Recent Company Announcements
          </h3>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
            <li>
              The new 4K monitors are now available for request. Check the{" "}
              <Link to="/assets" className="link link-primary">
                Assets page
              </Link>
              !
            </li>
            <li>Reminder: All assets must be returned upon resignation.</li>
            <li>Your request for "Office Desk Lamp" has been approved!</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default EPdash;
