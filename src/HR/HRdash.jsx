import React from "react";
import { FaBoxes, FaUsers } from "react-icons/fa";
import useAuth from "../useAuth";

// Placeholder for user context (should come from actual auth context)

const HRdash = () => {
  let { user, affiliations, assets, users } = useAuth();
  let hrInfo = users.find((u) => u.email === user.email);
  let myAff = affiliations.filter((a) => a.hrEmail === user.email);
  let myAssets = assets.filter((a) => a.email === user.email);
  return (
    // Using a standard div to hold the main content, removing the Drawer
    <div className="min-h-screen bg-base-200">
      {/* Page Content: HR DASHBOARD HOME (Asset List Overview) */}
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-4xl font-bold text-primary mb-6">
          Welcome, {user.displayName}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Asset List Overview & Key Analytics
        </p>

        {/* HR Dashboard: Employee Limit Card */}
        <div className="stats shadow-lg mb-8 w-full bg-base-100 border-t-4 border-secondary">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaUsers className="w-8 h-8" />
            </div>
            <div className="stat-title text-base">Current Employee Limit</div>
            <div className="stat-value text-secondary">
              {myAff.length} / {hrInfo.packageLimit}
            </div>
            <div className="stat-desc">
              {hrInfo.currentEP >= hrInfo.packageLimit ? (
                <span className="text-error font-bold">
                  Limit Reached. Upgrade Now!
                </span>
              ) : (
                `You have ${
                  hrInfo.packageLimit - hrInfo.currentEP
                } slots remaining.`
              )}
            </div>
          </div>
          {/* Placeholder Stat Card 1 */}
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaBoxes className="w-8 h-8" />
            </div>
            <div className="stat-title text-base">Total Assets</div>
            <div className="stat-value text-primary">{myAssets.length}</div>
            <div className="stat-desc">210 Assigned</div>
          </div>
          {/* Placeholder Stat Card 2 */}
          <div className="stat">
            <div className="stat-figure text-accent">
              <FaBoxes className="w-8 h-8" />
            </div>
            <div className="stat-title text-base">Pending Requests</div>
            <div className="stat-value">25</div>
            <div className="stat-desc text-accent">View all requests</div>
          </div>
        </div>

        {/* Placeholder for Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart Placeholder */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="card-title text-secondary">
              Asset Distribution (Returnable vs Non-returnable)
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded-lg mt-4">
              [Recharts Pie Chart Placeholder]
            </div>
          </div>
          {/* Bar Chart Placeholder */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="card-title text-secondary">
              Top 5 Most Requested Assets
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded-lg mt-4">
              [Recharts Bar Chart Placeholder]
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HRdash;
