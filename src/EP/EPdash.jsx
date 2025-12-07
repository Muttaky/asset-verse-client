import React from "react";
import { Link, Outlet } from "react-router";
import {
  FaBoxes,
  FaUserTag,
  FaUsers,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaHome,
} from "react-icons/fa";

// Placeholder data for Employee context
const employeeInfo = {
  name: "Diana Prince",
  email: "diana@assetverse.com",
  currentCompany: "AssetVerse HQ",
  totalAssetsAssigned: 2,
  userPhoto:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const EPdash = () => {
  // Define the navigation links using the paths provided in index.js
  const navLinks = [
    { name: "Dashboard Home", path: "/ep-dash", icon: FaHome },
    { name: "Assets", path: "/assets", icon: FaBoxes }, // All Available Assets
    { name: "My Assets", path: "/my-assets", icon: FaUserTag }, // Assigned Assets
    { name: "My Team", path: "/my-team", icon: FaUsers },
    { name: "My Requests", path: "/my-request", icon: FaClipboardList },
  ];

  const handleLogout = () => {
    // Implement actual logout logic here
    console.log("Employee logged out.");
  };

  const SidebarContent = (
    <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content font-semibold">
      {/* Employee & Company Branding */}
      <div className="p-4 mb-6 border-b border-secondary/20">
        <h2 className="text-xl font-bold text-secondary">
          {employeeInfo.currentCompany}
        </h2>
        <p className="text-sm text-primary">Employee Panel</p>
      </div>

      {/* Main Navigation Links */}
      {navLinks.map((item) => (
        <li key={item.name} className="my-1">
          <Link
            to={item.path}
            className="flex items-center text-lg hover:bg-secondary/10 transition-all duration-200"
          >
            <item.icon className="w-5 h-5 text-primary" />
            {item.name}
          </Link>
        </li>
      ))}

      {/* Profile and Logout */}
      <div className="divider my-4"></div>

      <li className="my-1">
        {/* Using /my-profile path as defined in index.js */}
        <Link
          to="/my-profile"
          className="flex items-center text-lg hover:bg-secondary/10 transition-all duration-200"
        >
          <FaUserCircle className="w-5 h-5 text-accent" />
          My Profile
        </Link>
      </li>
      <li className="mt-2">
        <button
          onClick={handleLogout}
          className="flex items-center text-lg text-error hover:bg-error/10 transition-all duration-200"
        >
          <FaSignOutAlt className="w-5 h-5" />
          Logout
        </button>
      </li>
    </ul>
  );

  return (
    // DaisyUI Drawer for responsive dashboard layout
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">
        {/* Dashboard Header/Navbar for Mobile */}
        <div className="w-full navbar bg-base-100 shadow-md lg:hidden sticky top-0 z-10">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-3"
              className="btn btn-ghost btn-circle drawer-button text-secondary"
            >
              <FaBars className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <h1 className="text-xl font-bold text-primary">Employee Panel</h1>
          </div>
          {/* User Avatar */}
          <div className="flex-none">
            <div className="avatar">
              <div className="w-10 rounded-full border-2 border-secondary/50">
                <img alt="Employee Profile" src={employeeInfo.userPhoto} />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content: EMPLOYEE DASHBOARD HOME (Overview) */}
        <main className="flex-grow p-4 md:p-8">
          <h1 className="text-4xl font-bold text-secondary mb-6">
            Welcome, {employeeInfo.name}!
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
              <div className="stat-value text-3xl">
                {employeeInfo.totalAssetsAssigned}
              </div>
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
              <div className="stat-title">Pending Requests (Placeholder)</div>
              <div className="stat-value text-secondary">1</div>
              <div className="stat-desc">
                <Link
                  to="/my-request"
                  className="link link-hover text-secondary"
                >
                  Track Requests
                </Link>
              </div>
            </div>

            <div className="stat shadow-lg bg-base-100 border-l-4 border-info">
              <div className="stat-figure text-info">
                <FaBoxes className="w-6 h-6" />
              </div>
              <div className="stat-title">
                Available Inventory (Placeholder)
              </div>
              <div className="stat-value text-info">60+ items</div>
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

      {/* Sidebar Content */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {SidebarContent}
      </div>
    </div>
  );
};

export default EPdash;
