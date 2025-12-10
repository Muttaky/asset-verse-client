import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { FaSearch, FaBoxes, FaPlusCircle, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../useAuth";
// Placeholder Data for All Company Assets (Simulating data fetched from the HR inventory)
import { useNavigate } from "react-router";

const Assets = () => {
  let { user } = useAuth();
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 6;
  useEffect(() => {
    fetch(
      `http://localhost:3000/assets?limit=${limit}&skip=${currentPage * limit}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAssets(data.result);
        setCount(data.count);
        const pages = Math.ceil(data.count / limit);
        setPage(pages);
      });
  }, [currentPage]);

  const initialAssets = assets;
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
  const handleRequestAsset = (asset) => {
    //DB start
    const today = new Date().toISOString().split("T")[0];
    const newRequest = {
      assetId: asset._id,
      assetName: asset.name,
      assetImage: asset.photo,
      assetType: asset.type,
      requestDate: today,
      companyName: asset.companyName,
      epName: user.displayName,
      epEmail: user.email,
      hrEmail: asset.email,
      status: "pending",
      approvalDate: "N/A",
    };
    fetch("http://localhost:3000/requests", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newRequest),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("after post asset", data);
        if (data.insertedId) {
          toast("asset added successfully");
        }
      });

    navigate("/my-request");

    // or submit a request directly via an API call.
    toast(
      `Request submitted for: ${asset.name}. HR will review your request shortly.`
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
          <span>Available asset = {count}</span>
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
            <option value="returnable">Returnable</option>
            <option value="non-returnable">Non-returnable</option>
          </select>
        </div>
      </div>

      {/* Asset Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <div
              key={asset._id}
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
                      {asset.availableQuantity} / {asset.quantity}
                    </span>
                  </div>
                  {/* Status Badge */}
                  <div
                    className={`badge badge-success badge-outline
                        
                    `}
                  >
                    In Stock
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button
                    onClick={() => handleRequestAsset(asset)}
                    className="btn btn-primary btn-block"
                  >
                    <FaPlusCircle /> Request Asset
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
      <div className="flex jutify-center flex-wrap gap-3 py-10">
        {currentPage > 0 && (
          <button
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
            className="btn"
          >
            Prev
          </button>
        )}
        {[...Array(page).keys()].map((i) => (
          <button
            onClick={() => {
              setCurrentPage(i);
            }}
            className={`btn ${i === currentPage && "btn-primary"}`}
          >
            {i + 1}
          </button>
        ))}
        {currentPage < page - 1 && (
          <button
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
            className="btn"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Assets;
