import React, { useState } from "react";
import { Link } from "react-router";
// Corrected imports, including FaUserTag
import {
  FaLaptop,
  FaChair,
  FaTshirt,
  FaUndo,
  FaTag,
  FaCheckCircle,
  FaSearch,
  FaUserTag,
  FaClock,
} from "react-icons/fa";
import useAuth from "../useAuth";
// Placeholder Data for Assets Assigned to the Employee

const MyAssets = () => {
  let { user, assigneds } = useAuth();
  let assignedAssets = assigneds.filter((a) => a.epEmail === user.email);
  const [assets, setAssets] = useState(assignedAssets);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssets = assets.filter((asset) =>
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Core Employee Action: Initiate Asset Return ---
  const handleInitiateReturn = (id) => {
    const asset = assets.find((a) => a.id === id);
    if (!asset || asset.type !== "Returnable") return;

    if (
      window.confirm(
        `Are you sure you want to initiate the return process for "${asset.name}"? HR will be notified.`
      )
    ) {
      // --- Placeholder for API Call to Create Return Request ---
      console.log(`Initiating return request for asset ID: ${id}`);

      // Update state to show return initiated status (simulated)
      setAssets(
        assets.map((a) =>
          a.id === id
            ? { ...a, status: "Return Pending", isReturning: true }
            : a
        )
      );
      alert(
        `Return request for ${asset.name} submitted successfully. Please await instructions from HR.`
      );
    }
  };

  // Helper to get icon based on asset name/type
  const getAssetIcon = (name) => {
    if (
      name.toLowerCase().includes("macbook") ||
      name.toLowerCase().includes("laptop")
    )
      return FaLaptop;
    if (name.toLowerCase().includes("chair")) return FaChair;
    if (
      name.toLowerCase().includes("t-shirt") ||
      name.toLowerCase().includes("swag")
    )
      return FaTshirt;
    return FaTag;
  };

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
        {/* FaUserTag is now correctly imported */}
        <FaUserTag className="text-secondary" /> My Assigned Assets
      </h1>
      <p className="text-gray-500 mb-6">
        A list of all equipment currently assigned to you by the company.
      </p>

      {/* Control Panel: Search */}
      <div className="flex justify-between items-center mb-6">
        <div className="form-control w-full md:w-1/3">
          <label className="input input-bordered flex items-center gap-2 bg-base-200">
            <FaSearch className="h-4 w-4 opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Assets Table (Responsive) */}
      <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          {/* Table Header */}
          <thead className="bg-base-200 text-secondary">
            <tr>
              <th className="font-semibold text-base">Asset</th>
              <th className="font-semibold text-base">Serial / Identifier</th>
              <th className="font-semibold text-base">Type</th>
              <th className="font-semibold text-base">Assigned On</th>
              <th className="font-semibold text-base text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => {
                const Icon = getAssetIcon(asset.assetName);
                const isReturning = asset.isReturning;

                return (
                  <tr
                    key={asset._id}
                    className="hover:bg-base-200/50 transition-colors duration-150"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="font-bold">{asset.assetName}</div>
                      </div>
                    </td>
                    <td className="font-mono text-sm opacity-50">
                      {asset._id}
                    </td>
                    <td>
                      <div
                        className={`badge ${
                          asset.assetType === "returnable"
                            ? "badge-info"
                            : "badge-secondary"
                        } text-white font-medium`}
                      >
                        {asset.assetType}
                      </div>
                    </td>
                    <td className="text-sm">{asset.assignmentDate}</td>
                    <td className="text-center">
                      {asset.assetType === "returnable" ? (
                        <button
                          onClick={() => handleInitiateReturn(asset.id)}
                          className={`btn btn-sm ${
                            isReturning
                              ? "btn-warning"
                              : "btn-outline btn-primary"
                          }`}
                          disabled={isReturning}
                        >
                          {isReturning ? (
                            <>
                              <FaClock /> Return Pending
                            </>
                          ) : (
                            <>
                              <FaUndo /> Initiate Return
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-success flex items-center justify-center font-semibold">
                          <FaCheckCircle className="mr-1" /> Permanent
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-lg text-gray-500"
                >
                  You currently have no assets assigned. Check the{" "}
                  <Link to="/assets" className="link link-primary">
                    Assets page
                  </Link>{" "}
                  to submit a request.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAssets;
