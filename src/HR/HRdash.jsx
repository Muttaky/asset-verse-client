import React from "react";
import { Link } from "react-router";
import {
  FaBoxes,
  FaPlusCircle,
  FaClipboardList,
  FaUsers,
  FaArrowUp,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";

// Placeholder for user context (should come from actual auth context)
const hrInfo = {
  companyName: "AssetVerse HQ",
  hrName: "Mr. Smith",
  currentEmployees: 7,
  packageLimit: 10,
  userPhoto: "https://i.ibb.co/L84m447/default-profile.jpg",
};

const HRdash = () => {
  // Define the navigation links using the paths provided in index.js
  const navLinks = [
    { name: "Dashboard Home", path: "/hr-dash", icon: MdOutlineDashboard },
    { name: "Asset List", path: "/assets-list", icon: FaBoxes }, // Links to sibling route /assets-list [cite: 198]
    { name: "Add Asset", path: "/add-assets", icon: FaPlusCircle },
    { name: "All Requests", path: "/request", icon: FaClipboardList }, // Links to sibling route /request [cite: 205]
    { name: "Employee List", path: "/ep-list", icon: FaUsers },
    { name: "Upgrade Package", path: "/upgrade-package", icon: FaArrowUp }, // Required feature [cite: 120] (using placeholder path)
  ];

  const handleLogout = () => {
    // Implement actual logout logic here
    console.log("HR Manager logged out.");
  };

  const SidebarContent = (
    <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content font-semibold">
      {/* Company Branding */}
      <div className="p-4 mb-6 border-b border-primary/20">
        <h2 className="text-2xl font-bold text-primary">
          {hrInfo.companyName}
        </h2>
        <p className="text-sm text-secondary">HR Manager Panel</p>
        <p className="mt-2 text-sm text-base-content">
          <span className="font-bold">
            {hrInfo.currentEmployees}/{hrInfo.packageLimit}
          </span>{" "}
          Employees Used [cite: 216]
        </p>
      </div>

      {/* Main Navigation Links */}
      {navLinks.map((item) => (
        <li key={item.name} className="my-1">
          <Link
            to={item.path}
            className="flex items-center text-lg hover:bg-primary/10 transition-all duration-200"
          >
            <item.icon className="w-5 h-5 text-secondary" />
            {item.name}
          </Link>
        </li>
      ))}

      {/* Profile and Logout */}
      <div className="divider my-4"></div>

      <li className="my-1">
        <Link
          to="/profile"
          className="flex items-center text-lg hover:bg-primary/10 transition-all duration-200"
        >
          <FaUserCircle className="w-5 h-5 text-accent" />
          Profile
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
    // DaisyUI Drawer for responsive dashboard layout (Full-width dashboard required [cite: 377])
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">
        {/* Dashboard Header/Navbar for Mobile (for opening the sidebar) */}
        <div className="w-full navbar bg-base-100 shadow-md lg:hidden sticky top-0 z-10">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-ghost btn-circle drawer-button text-primary"
            >
              <FaBars className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <h1 className="text-xl font-bold text-secondary">
              {hrInfo.companyName} Dashboard
            </h1>
          </div>
          {/* User Avatar */}
          <div className="flex-none">
            <div className="avatar">
              <div className="w-10 rounded-full border-2 border-primary/50">
                <img alt="HR Profile" src={hrInfo.userPhoto} />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content: HR DASHBOARD HOME (Asset List Overview) */}
        <main className="flex-grow p-4 md:p-8">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Welcome, {hrInfo.hrName}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Asset List Overview & Key Analytics [cite: 116, 346]
          </p>

          {/* HR Dashboard: Employee Limit Card [cite: 216] */}
          <div className="stats shadow-lg mb-8 w-full bg-base-100 border-t-4 border-secondary">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <FaUsers className="w-8 h-8" />
              </div>
              <div className="stat-title text-base">Current Employee Limit</div>
              <div className="stat-value text-secondary">
                {hrInfo.currentEmployees} / {hrInfo.packageLimit}
              </div>
              <div className="stat-desc">
                {hrInfo.currentEmployees >= hrInfo.packageLimit ? (
                  <span className="text-error font-bold">
                    Limit Reached.{" "}
                    <Link
                      to="/upgrade-package"
                      className="link link-hover text-error"
                    >
                      Upgrade Now!
                    </Link>
                  </span>
                ) : (
                  `You have ${
                    hrInfo.packageLimit - hrInfo.currentEmployees
                  } slots remaining.`
                )}
              </div>
            </div>
            {/* Placeholder Stat Card 1 */}
            <div className="stat">
              <div className="stat-figure text-primary">
                <FaBoxes className="w-8 h-8" />
              </div>
              <div className="stat-title text-base">
                Total Assets (Placeholder)
              </div>
              <div className="stat-value text-primary">4,200</div>
              <div className="stat-desc">210 Assigned</div>
            </div>
            {/* Placeholder Stat Card 2 */}
            <div className="stat">
              <div className="stat-figure text-accent">
                <FaClipboardList className="w-8 h-8" />
              </div>
              <div className="stat-title text-base">
                Pending Requests (Placeholder)
              </div>
              <div className="stat-value">25</div>
              <div className="stat-desc text-accent">View all requests</div>
            </div>
          </div>

          {/* Placeholder for Analytics Charts [cite: 346, 378] */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart Placeholder */}
            <div className="card bg-base-100 shadow-xl p-6">
              <h3 className="card-title text-secondary">
                Asset Distribution (Returnable vs Non-returnable) [cite: 347]
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded-lg mt-4">
                [Recharts Pie Chart Placeholder]
              </div>
            </div>
            {/* Bar Chart Placeholder */}
            <div className="card bg-base-100 shadow-xl p-6">
              <h3 className="card-title text-secondary">
                Top 5 Most Requested Assets [cite: 348]
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded-lg mt-4">
                [Recharts Bar Chart Placeholder]
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar Content */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {SidebarContent}
      </div>
    </div>
  );
};

export default HRdash;
