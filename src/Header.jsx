import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const Header = () => {
  const { user, logOut, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [allUsers, setAllUsers] = useState([]);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user?.email) {
      setRoleLoading(true);
      axiosSecure
        .get(`/users`)
        .then((res) => {
          setAllUsers(res.data);
          setRoleLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setRoleLoading(false);
        });
    } else {
      setAllUsers([]);
      setRoleLoading(false);
    }
  }, [user, authLoading, axiosSecure]);

  const newUser = allUsers.find((u) => u.email === user?.email);
  const role = newUser?.role || "guest";

  if (authLoading || roleLoading) {
    return (
      <div className="navbar bg-base-100 shadow-sm justify-center">
        <span className="loading loading-spinner loading-lg text-primary mx-auto my-4"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        {/* Navbar Start */}
        <div className="navbar-start">
          {/* Mobile Dropdown */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-primary"
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

          <Link
            to="/"
            className="btn btn-ghost text-3xl font-bold text-primary"
          >
            AssetVerse
          </Link>
        </div>

        {/* Navbar Center (Desktop) */}
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 text-primary text-xl">
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

        {/* Navbar End */}
        {user ? (
          <div className="navbar-end">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="User Avatar" src={user.photoURL} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-primary"
              >
                {/* Role-specific Links */}
                {role === "hr" ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}

                {/* Common */}
                <li>
                  <Link to="/my-profile">My Profile</Link>
                </li>
                <li>
                  <a onClick={logOut}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="navbar-end">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
