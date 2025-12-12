import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import {
  FaUsers,
  FaSearch,
  FaTrash,
  FaMinusCircle,
  FaSync,
} from "react-icons/fa";
import useAuth from "../useAuth";
import { toast } from "react-toastify";
import useAxiosSecure from "../useAxiosSecure";

const EPList = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [allEmployees, setAllEmployees] = useState([]);
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployeeData = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [affiliationsRes, assignedsRes] = await Promise.all([
        axiosSecure.get(`/affiliations`),
        axiosSecure.get(`/assigneds`),
      ]);
      const affiliations = affiliationsRes.data;
      const assigneds = assignedsRes.data;
      const hrEmployees = affiliations.filter((e) => e.hrEmail === user.email);
      setAllEmployees(hrEmployees);
      setAssignedAssets(assigneds);
    } catch (error) {
      console.error("Error fetching employee list data:", error);
      toast.error("Failed to load employee data.");
    } finally {
      setLoading(false);
    }
  }, [user, axiosSecure]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const filteredEmployees = allEmployees.filter(
    (employee) =>
      employee.epName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.epEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const activeEmployeeCount = allEmployees.filter(
    (e) => e.status === "active"
  ).length;

  const handleRemoveEmployee = async (employee) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${employee.epName}? This will also remove all assigned assets.`
      )
    ) {
      return;
    }
    try {
      const affiliationResponse = await axiosSecure.delete(
        `/affiliations/${employee._id}`
      );
      if (affiliationResponse.data.deletedCount === 1) {
        toast.success(`${employee.epName}'s affiliation removed.`);
        const assignedResponse = await axiosSecure.delete(
          `/assigneds?hrEmail=${user.email}&epEmail=${employee.epEmail}`
        );
        if (assignedResponse.data.deletedCount >= 0) {
          toast.info(
            `${assignedResponse.data.deletedCount} asset(s) unassigned and marked for return.`
          );
          setAllEmployees((prev) => prev.filter((e) => e._id !== employee._id));
        } else {
          toast.warn("No assigned assets to clean up.");
        }
      } else {
        toast.error("Affiliation deletion failed. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred during employee removal.");
      console.error("Removal Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <FaSync className="animate-spin text-primary text-4xl mr-3" />
        <p className="text-xl text-gray-600">Loading Employee List...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
        <FaUsers className="text-primary" />
        Affiliated Employee List
      </h1>
      <p className="text-gray-500 mb-6">
        View and manage all employees currently affiliated with your company.
      </p>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
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
        <div className="stats shadow bg-primary text-primary-content w-full md:w-auto">
          <div className="stat">
            <div className="stat-figure text-primary-content">
              <FaUsers className="h-6 w-6" />
            </div>
            <div className="stat-title text-primary-content opacity-70">
              Total Active Employees
            </div>
            <div className="stat-value text-3xl">{activeEmployeeCount}</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
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
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => {
                const assetsCount = assignedAssets.filter(
                  (asset) => employee.epEmail === asset.epEmail
                ).length;
                return (
                  <tr
                    key={employee._id}
                    className="hover:bg-base-200/50 transition-colors duration-150"
                  >
                    <td className="font-bold">{employee.epName}</td>
                    <td className="text-sm opacity-80">{employee.epEmail}</td>
                    <td className="text-center">
                      <div
                        className={`badge ${
                          employee.status === "active"
                            ? "badge-success"
                            : "badge-warning"
                        } text-white`}
                      >
                        {employee.status}
                      </div>
                    </td>
                    <td className="text-center text-secondary font-semibold">
                      {assetsCount}
                    </td>
                    <td>{employee.affiliationDate || "N/A"}</td>
                    <td className="flex justify-center space-x-2">
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
                  {allEmployees.length === 0 && searchTerm === ""
                    ? "You currently have no affiliated employees."
                    : `No employees found matching "${searchTerm}".`}
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
