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

// Placeholder Data for Employee List (Simulating data affiliated after first asset approval)
const initialEmployees = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@company.com",
    status: "Active",
    assets: 3,
    joinDate: "2024-11-28",
  },
  {
    id: 2,
    name: "Bob Kellar",
    email: "bob@company.com",
    status: "Active",
    assets: 1,
    joinDate: "2024-11-25",
  },
  {
    id: 3,
    name: "Charlie Davis",
    email: "charlie@company.com",
    status: "Active",
    assets: 0,
    joinDate: "2024-11-20",
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@company.com",
    status: "Active",
    assets: 2,
    joinDate: "2024-11-15",
  },
  {
    id: 5,
    name: "Eve Barton",
    email: "eve@company.com",
    status: "Inactive",
    assets: 0,
    joinDate: "2024-10-10",
  },
];

const EPList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState(initialEmployees); // State for handling status changes

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Core HR Action: Remove Employee ---
  // Note: According to the requirements, removing an employee should automatically
  // handle the return of all 'Returnable' assets and end the company affiliation.
  const handleRemoveEmployee = (id) => {
    const employee = employees.find((e) => e.id === id);
    if (!employee) return;

    if (employee.assets > 0) {
      const confirmMsg = `WARNING: ${employee.name} has ${employee.assets} assigned assets. Removing them will mark all assets as returned and end affiliation. Proceed?`;
      if (!window.confirm(confirmMsg)) return;
    }

    // --- Placeholder for API Call to Remove Employee & Return Assets ---
    console.log(
      `Removing employee ${employee.name} (ID: ${id}) and returning ${employee.assets} assets.`
    );

    // Simulate removal by filtering from the list
    setEmployees(employees.filter((e) => e.id !== id));
    alert(
      `${employee.name} has been successfully removed and assets returned. (Placeholder)`
    );
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
              {employees.filter((e) => e.status === "Active").length}
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
              filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-base-200/50 transition-colors duration-150"
                >
                  <td className="font-bold">{employee.name}</td>
                  <td className="text-sm opacity-80">{employee.email}</td>
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
                    {employee.assets}
                  </td>
                  <td>{employee.joinDate}</td>
                  <td className="flex justify-center space-x-2">
                    {/* View Assets Button (Placeholder for routing to detailed employee view) */}
                    <Link
                      to={`/employee-details/${employee.id}`}
                      className="btn btn-sm btn-info btn-square transition-transform hover:scale-105"
                      aria-label="View Assigned Assets"
                    >
                      <FaEye className="w-4 h-4" />
                    </Link>
                    {/* Remove Employee Button (Error/Danger color) */}
                    <button
                      onClick={() => handleRemoveEmployee(employee.id)}
                      className="btn btn-sm btn-error btn-square transition-transform hover:scale-105"
                      aria-label="Remove Employee Affiliation"
                    >
                      <FaMinusCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
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
