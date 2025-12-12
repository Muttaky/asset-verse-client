import React, { useEffect, useState } from "react";
import { FaBoxes, FaUsers } from "react-icons/fa";
import useAuth from "../useAuth";
import {
  BarChart,
  Bar,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  LabelList,
} from "recharts";
import { Link } from "react-router";
import useAxiosSecure from "../useAxiosSecure";

// Custom Colors for Charts (using DaisyUI theme placeholders)
const PIE_COLORS = ["#0A676E", "#0D9488", "#1E40AF", "#9333EA", "#F59E0B"];
const BAR_COLOR = "#0D9488"; // Secondary color

const HRdash = () => {
  let { user } = useAuth();
  let axiosSecure = useAxiosSecure();
  let [users, setUsers] = useState([]);
  useEffect(() => {
    axiosSecure(`/users`).then((data) => {
      setUsers(data.data);
    });
  }, []);
  let [affiliations, setAffiliations] = useState([]);
  useEffect(() => {
    axiosSecure(`/affiliations`).then((data) => {
      setAffiliations(data.data);
    });
  }, []);
  let [assigneds, setAssigneds] = useState([]);
  useEffect(() => {
    axiosSecure(`/assigneds`).then((data) => {
      setAssigneds(data.data);
    });
  }, []);
  let [requests, setRequests] = useState([]);
  useEffect(() => {
    axiosSecure(`/requests`).then((data) => {
      setRequests(data.data);
    });
  }, []);

  let hrInfo = users.find((u) => u.email === user.email);
  let myAff = affiliations.filter((a) => a.hrEmail === user.email);
  const [asset, setAssets] = useState([]);

  useEffect(() => {
    axiosSecure("http://localhost:3000/assets").then((data) =>
      setAssets(data.data.result)
    );
  }, []);
  let assets = asset;
  let myAssets = assets.filter((a) => a.email === user.email);
  let myAssign = assigneds.filter((a) => a.hrEmail === user.email);
  let myReq = requests.filter(
    (r) => r.hrEmail === user.email && r.status === "pending"
  );

  // --- 1. Top 5 Requested Assets Data (for Bar Chart) ---
  let countMap = {};
  myReq.forEach((a) => {
    countMap[a.assetName] = (countMap[a.assetName] || 0) + 1;
  });

  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  let data02 = sorted.map(([assetName, count]) => ({
    assetName,
    count,
  }));

  // --- 2. Returnable vs Non-returnable Data (for Pie Chart) ---
  let typeR = myAssets.filter((a) => a.type === "returnable");
  let typeN = myAssets.filter((a) => a.type === "non-returnable");
  const data01 = [
    { name: "Returnable Assets", value: typeR.length },
    { name: "Non-returnable Assets", value: typeN.length },
  ];

  const packageLimit = hrInfo?.packageLimit || 0;
  const currentEP = myAff.length;
  const slotsRemaining = packageLimit - currentEP;

  return (
    <div className="min-h-screen bg-base-200">
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-4xl font-bold text-primary mb-6">
          Welcome, {user.displayName}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Asset List Overview & Key Analytics
        </p>

        {/* HR Dashboard: Stats Cards */}
        <div className="stats shadow-lg mb-8 w-full bg-base-100 border-t-4 border-secondary">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaUsers className="w-8 h-8" />
            </div>
            <div className="stat-title text-base">Current Employee Limit</div>
            <div className="stat-value text-secondary">
              {currentEP} / {packageLimit}
            </div>
            <div className="stat-desc">
              {currentEP >= packageLimit ? (
                <Link to="/pack" className="text-error font-bold btn ">
                  Limit Reached. Upgrade Now!
                </Link>
              ) : (
                `You have ${slotsRemaining} slots remaining.`
              )}
            </div>
          </div>
          {/* Total Assets Stat Card */}
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaBoxes className="w-8 h-8" />
            </div>
            <div className="stat-title text-base">Total Assets</div>
            <div className="stat-value text-primary">{myAssets.length}</div>
            <div className="stat-desc">{myAssign.length} Assigned</div>
          </div>
          {/* Pending Requests Stat Card */}
          <div className="stat">
            <div className="stat-figure text-accent">
              <FaBoxes className="w-8 h-8" />
            </div>
            <div className="stat-title text-base">Pending Requests</div>
            <div className="stat-value">{myReq.length}</div>
            <Link to="/request" className="stat-desc text-accent">
              View all requests
            </Link>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart: Asset Distribution */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="card-title text-secondary">
              Asset Distribution (Total: {myAssets.length})
            </h3>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data01}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    isAnimationActive={true}
                  >
                    {data01.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} items`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Top 5 Requested Assets */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="card-title text-secondary">
              Top 5 Most Requested Assets
            </h3>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data02}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="assetName" tick={false} />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} requests`, "Requests"]}
                  />
                  <Bar dataKey="count" fill={BAR_COLOR}>
                    <LabelList
                      dataKey="assetName"
                      position="top"
                      angle={-45}
                      offset={10}
                      fill="#333"
                      style={{ fontSize: "10px" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HRdash;
