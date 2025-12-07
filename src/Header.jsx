import React from "react";
import { Link } from "react-router";
import useAuth from "./useAuth";

const Header = ({ users }) => {
  let { user, logOut } = useAuth();
  let newUser = users.find((u) => u.email === user?.email);

  let role = newUser?.role || "guest";
  console.log(newUser, role);
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/">Home</Link>
              </li>
              {user ? (
                <>
                  {role === "hr" ? (
                    <li>
                      <Link to="/hr-dash">HR Dashboard</Link>
                    </li>
                  ) : (
                    <li>
                      <Link to="/ep-dash">Employee DashBoard</Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  {" "}
                  <li>
                    <Link to="/ep-reg">Join as Employee</Link>
                  </li>
                  <li>
                    <Link to="/hr-reg">Join as HR Manager</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl">
            AssetVerse
          </Link>
        </div>
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            {user ? (
              <>
                {role === "hr" ? (
                  <li>
                    <Link to="/hr-dash">HR Dashboard</Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/ep-dash">Employee DashBoard</Link>
                  </li>
                )}
              </>
            ) : (
              <>
                {" "}
                <li>
                  <Link to="/ep-reg">Join as Employee</Link>
                </li>
                <li>
                  <Link to="/hr-reg">Join as HR Manager</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {user ? (
          <>
            {role === "hr" ? (
              <div className="navbar-end">
                {" "}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex="-1"
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <Link to="/assets-list">Assets List</Link>
                    </li>

                    <li>
                      <Link to="/add-assets">Add Assets</Link>
                    </li>

                    <li>
                      <Link to="/request">All Request</Link>
                    </li>

                    <li>
                      <Link to="/ep-list">Employee List</Link>
                    </li>

                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li
                      onClick={() => {
                        logOut();
                      }}
                    >
                      <a>Logout</a>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="navbar-end">
                {" "}
                <div className=" dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex="-1"
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <Link to="/assets">Assets</Link>
                    </li>
                    <li>
                      <Link to="/my-assets">My Assets</Link>
                    </li>
                    <li>
                      <Link to="/my-team">My Team</Link>
                    </li>
                    <li>
                      <Link to="/my-request">My Requested Assets</Link>
                    </li>
                    <li>
                      <Link to="/my-profile">My Profile</Link>
                    </li>
                    <li
                      onClick={() => {
                        logOut();
                      }}
                    >
                      <a>Logout</a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {" "}
            <div className="navbar-end">
              <Link to="/login" className="btn">
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
