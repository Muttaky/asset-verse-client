import React, { useState } from "react";
import { Link } from "react-router";
import { FaSearch, FaBoxes, FaPlusCircle, FaFilter } from "react-icons/fa";

// Placeholder Data for All Company Assets (Simulating data fetched from the HR inventory)
const initialAssets = [
  {
    id: 1,
    name: "MacBook Pro M3",
    type: "Returnable",
    stock: 5,
    assigned: 10,
    totalStock: 15,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    type: "Returnable",
    stock: 5,
    assigned: 45,
    totalStock: 50,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Company Swag T-Shirt (L)",
    type: "Non-returnable",
    stock: 50,
    assigned: 150,
    totalStock: 200,
    isAvailable: true,
  },
  {
    id: 4,
    name: "4K External Monitor",
    type: "Returnable",
    stock: 0,
    assigned: 25,
    totalStock: 25,
    isAvailable: false,
  }, // Out of Stock
  {
    id: 5,
    name: "Wireless Keyboard & Mouse",
    type: "Returnable",
    stock: 20,
    assigned: 40,
    totalStock: 60,
    isAvailable: true,
  },
  {
    id: 6,
    name: "Water Bottle",
    type: "Non-returnable",
    stock: 100,
    assigned: 0,
    totalStock: 100,
    isAvailable: true,
  },
];

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Filter assets based on search term and type filter
  const filteredAssets = initialAssets.filter((asset) => {
    const matchesSearch = asset.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || asset.type === filterType;
    return matchesSearch && matchesType;
  });

  // --- Placeholder Action Handler ---
  const handleRequestAsset = (assetName) => {
    // In a real application, this would navigate the user to a request form
    // or submit a request directly via an API call.
    alert(
      `Request submitted for: ${assetName}. HR will review your request shortly.`
    );
    // Navigate to the My Requests page after submission (Placeholder logic)
    // Link to="/my-request" is the path you defined.
  };

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
        <FaBoxes className="text-secondary" /> Company Asset Inventory
      </h1>
      <p className="text-gray-500 mb-6">
        Browse all available assets and submit a request to your HR Manager.
      </p>

      {/* Control Panel: Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-base-200 p-4 rounded-lg">
        {/* Search Input */}
        <div className="form-control w-full md:w-1/3">
          <label className="input input-bordered flex items-center gap-2">
            <FaSearch className="h-4 w-4 opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Search assets by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-secondary" />
          <select
            className="select select-bordered w-full max-w-xs"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Returnable">Returnable</option>
            <option value="Non-returnable">Non-returnable</option>
          </select>
        </div>
      </div>

      {/* Asset Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="card bg-base-100 shadow-xl border-t-4 border-primary/50"
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="card-title text-secondary">{asset.name}</h2>
                  <div
                    className={`badge ${
                      asset.type === "Returnable"
                        ? "badge-primary"
                        : "badge-secondary"
                    } text-white`}
                  >
                    {asset.type}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  {asset.type === "Returnable"
                    ? "Must be returned upon leaving the company."
                    : "Permanent assignment."}
                </p>

                <div className="flex justify-between items-center text-sm font-semibold mb-4">
                  <div className="flex items-center">
                    <span className="text-gray-600">Available:</span>
                    <span
                      className={`ml-2 font-bold ${
                        asset.isAvailable ? "text-success" : "text-error"
                      }`}
                    >
                      {asset.stock} / {asset.totalStock}
                    </span>
                  </div>
                  {/* Status Badge */}
                  <div
                    className={`badge ${
                      asset.isAvailable
                        ? "badge-success badge-outline"
                        : "badge-error"
                    }`}
                  >
                    {asset.isAvailable ? "In Stock" : "Out of Stock"}
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button
                    onClick={() => handleRequestAsset(asset.name)}
                    className="btn btn-primary btn-block"
                    disabled={!asset.isAvailable}
                  >
                    <FaPlusCircle />{" "}
                    {asset.isAvailable ? "Request Asset" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">
              No assets found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assets;
