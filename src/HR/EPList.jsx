import React, { useState } from "react";
import { Link } from "react-router";
import {
  FaUsers,
  FaSearch,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaMinusCircle,
  FaSync,
} from "react-icons/fa";
import useAuth from "../useAuth";
import { toast } from "react-toastify";
// Placeholder Data for Employee List (Simulating data affiliated after first asset approval)

const EPList = () => {
  let { user, affiliations, assigneds } = useAuth();
  const allEmployees = affiliations;
  let initialEmployees = allEmployees.filter((e) => e.hrEmail === user.email);
  let myAssi = assigneds.filter((s) => s.hrEmail === user.email);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState(initialEmployees); // State for handling status changes

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.epName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.epEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Core HR Action: Remove Employee ---
  // Note: According to the requirements, removing an employee should automatically
  // handle the return of all 'Returnable' assets and end the company affiliation.
  const handleRemoveEmployee = async (ep) => {
    try {
      let response = await fetch(
        `http://localhost:3000/affiliations/${ep._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.deletedCount === 1) {
        toast(
          `${ep.epName} has been successfully removed and assets returned.`
        );
      } else {
        toast.error("Deletion failed. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred during deletion.");
      console.error(error);
    }

    try {
      const response = await fetch(
        `http://localhost:3000/assigneds?hrEmail=${user.email}&epEmail=${ep.epEmail}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.deletedCount > 0) {
        toast(`${data.deletedCount} asset(s) removed for ${ep.epEmail}`);
        window.location.reload();
      } else {
        toast.error("No assigned assets found for this employee.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
        <FaUsers className="text-primary" /> Affiliated Employee List
      </h1>
      <p className="text-gray-500 mb-6">
        View and manage all employees currently affiliated with your company.
      </p>

      {/* Control Panel: Search and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Input */}
        <div className="form-control w-full md:w-1/3">
          <label className="input input-bordered flex items-center gap-2 bg-base-200">
            <FaSearch className="h-4 w-4 opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        {/* Quick Stats Card (Using Primary Color) */}
        <div className="stats shadow bg-primary text-primary-content w-full md:w-auto">
          <div className="stat">
            <div className="stat-figure text-primary-content">
              <FaUsers className="h-6 w-6" />
            </div>
            <div className="stat-title text-primary-content opacity-70">
              Total Active Employees
            </div>
            <div className="stat-value text-3xl">
              {employees.filter((e) => e.status === "active").length}
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table (Responsive) */}
      <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          {/* Table Header */}
          <thead className="bg-base-200 text-primary">
            <tr>
              <th className="font-semibold text-base">Employee Name</th>
              <th className="font-semibold text-base">Email</th>
              <th className="font-semibold text-base text-center">Status</th>
              <th className="font-semibold text-base text-center">
                Assets Assigned
              </th>
              <th className="font-semibold text-base">Joined On</th>
              <th className="font-semibold text-base text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => {
                let aas = myAssi.filter((m) => employee.epEmail === m.epEmail);
                return (
                  <tr
                    key={employee.id}
                    className="hover:bg-base-200/50 transition-colors duration-150"
                  >
                    <td className="font-bold">{employee.epName}</td>
                    <td className="text-sm opacity-80">{employee.epEmail}</td>
                    <td className="text-center">
                      <div
                        className={`badge ${
                          employee.status === "Active"
                            ? "badge-success"
                            : "badge-warning"
                        } text-white`}
                      >
                        {employee.status}
                      </div>
                    </td>
                    <td className="text-center text-secondary font-semibold">
                      {aas.length}
                    </td>
                    <td>{employee.affiliationDate}</td>
                    <td className="flex justify-center space-x-2">
                      {/* View Assets Button (Placeholder for routing to detailed employee view) */}

                      {/* Remove Employee Button (Error/Danger color) */}
                      <button
                        onClick={() => handleRemoveEmployee(employee)}
                        className="btn btn-sm btn-error btn-square transition-transform hover:scale-105"
                        aria-label="Remove Employee Affiliation"
                      >
                        <FaMinusCircle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-lg text-gray-500"
                >
                  No employees found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EPList;
