import React, { useState } from "react";
import { FaBoxes, FaSave, FaSync, FaInfoCircle } from "react-icons/fa";

const AddAssets = () => {
  // 1. State for form inputs
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("Returnable"); // Default to Returnable
  const [stockQuantity, setStockQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Placeholder form submission logic
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const newAsset = {
      name: assetName,
      type: assetType,
      stock: parseInt(stockQuantity),
      description: description,
      addedBy: "HR Manager (Placeholder)",
      dateAdded: new Date().toISOString(),
    };

    // --- API Call Simulation ---
    console.log("Submitting New Asset:", newAsset);

    setTimeout(() => {
      setLoading(false);
      // Success Notification Placeholder
      alert(
        `Asset '${assetName}' (${stockQuantity} units) added successfully!`
      );

      // Reset form
      setAssetName("");
      setAssetType("Returnable");
      setStockQuantity("");
      setDescription("");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
        <FaBoxes className="text-primary" /> Add New Asset to Inventory
      </h1>
      <p className="text-gray-500 mb-6">
        Fill out the details below to register a new corporate asset.
      </p>

      {/* Main Form Card */}
      <div className="card bg-base-100 shadow-2xl p-6 md:p-10 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Asset Name Field */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-lg font-semibold text-base-content">
                Asset Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g., MacBook Pro M3, Office Chair, ID Card"
              className="input input-bordered w-full input-lg focus:border-primary"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
            />
          </div>

          {/* Asset Type & Stock Quantity Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Asset Type (Returnable/Non-returnable) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold text-base-content">
                  Asset Type <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full select-lg focus:border-primary"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                required
              >
                <option value="Returnable">
                  Returnable (e.g., Laptops, Monitors)
                </option>
                <option value="Non-returnable">
                  Non-returnable (e.g., Swag, Stationery)
                </option>
              </select>
              <div className="label pt-2">
                <span className="label-text-alt flex items-center gap-1 text-xs">
                  <FaInfoCircle className="text-info" /> Essential for stock and
                  employee tracking.
                </span>
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold text-base-content">
                  Stock Quantity <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                placeholder="Total units available"
                className="input input-bordered w-full input-lg focus:border-primary"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          {/* Description Field */}
          <div className="form-control mb-8">
            <label className="label">
              <span className="label-text text-lg font-semibold text-base-content">
                Product Description / Notes (Optional)
              </span>
            </label>
            <textarea
              placeholder="Include details like model number, condition, or purchasing info."
              className="textarea textarea-bordered h-32 focus:border-primary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary btn-lg font-bold transition-transform duration-300 hover:scale-[1.01]`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSync className="animate-spin" /> Adding Asset...
                </>
              ) : (
                <>
                  <FaSave /> Save Asset to Inventory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssets;
