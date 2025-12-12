import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlusCircle,
  FaFilter,
} from "react-icons/fa";
import useAuth from "../useAuth";
import useAxiosSecure from "../useAxiosSecure";

// Placeholder Data for Assets List (Simulating data fetched from a backend)

const AssetsList = () => {
  let { user } = useAuth();
  let axiosSecure = useAxiosSecure();

  const [assets, setAssets] = useState([]);
  useEffect(() => {
    axiosSecure(`http://localhost:3000/assets?email=${user.email}`).then(
      (data) => {
        setAssets(data.data.result);
      }
    );
  }, []);

  let initialAssets = assets;
  const [searchTerm, setSearchTerm] = useState("");

  // Filter assets based on search term (case-insensitive)
  const filteredAssets = initialAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Placeholder Action Handlers ---
  const handleUpdate = (id) => console.log(`Updating asset ID: ${id}`);
  const handleDelete = (id) => {
    // In a real application, this would trigger an API call to delete the asset
    console.log(`Deleting asset ID: ${id}`);
    alert(`Asset ID ${id} deleted successfully! (Placeholder)`);
  };

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-secondary mb-2">
        All Added Assets
      </h1>
      <p className="text-gray-500 mb-6">
        Manage your company's complete asset inventory.
      </p>

      {/* Control Panel: Search, Filter, and Add Asset Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Input */}
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

        {/* Add Asset Button */}
        <Link to="/add-assets" className="btn btn-primary w-full md:w-auto">
          <FaPlusCircle /> Add New Asset
        </Link>
      </div>

      {/* Assets Table (Responsive) */}
      <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          {/* Table Header */}
          <thead className="bg-base-200 text-primary">
            <tr>
              <th className="font-semibold text-base">Name</th>
              <th className="font-semibold text-base text-center">Stock</th>
              <th className="font-semibold text-base text-center">Assigned</th>
              <th className="font-semibold text-base text-center">Available</th>
              <th className="font-semibold text-base text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="hover:bg-base-200/50 transition-colors duration-150"
                >
                  <td className="font-medium text-base-content">
                    {asset.name}
                  </td>

                  <td className="text-center">{asset.quantity}</td>
                  <td className="text-center text-warning font-semibold">
                    {asset.assigned || 5}
                  </td>
                  <td className="text-center text-success font-semibold">
                    {asset.stock - asset.assigned || 5}
                  </td>
                  <td className="flex justify-center space-x-2">
                    {/* Action Buttons using consistent colors */}
                    <button
                      onClick={() => handleUpdate(asset.id)}
                      className="btn btn-sm btn-info btn-square transition-transform hover:scale-105"
                      aria-label="Edit Asset"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="btn btn-sm btn-error btn-square transition-transform hover:scale-105"
                      aria-label="Delete Asset"
                    >
                      <FaTrash className="w-4 h-4" />
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
                  No assets found matching "{searchTerm}".
                  <br />
                  <Link
                    to="/add-assets"
                    className="link link-primary mt-2 inline-block"
                  >
                    Click here to add a new asset.
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex justify-end mt-6">
        <div className="join">
          <button className="join-item btn">«</button>
          <button className="join-item btn btn-primary">Page 1</button>
          <button className="join-item btn">»</button>
        </div>
      </div>
    </div>
  );
};

export default AssetsList;
