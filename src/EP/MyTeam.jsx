import React, { useState } from "react";
import {
  FaUsers,
  FaUserCircle,
  FaEnvelope,
  FaTag,
  FaSearch,
  FaBriefcase,
} from "react-icons/fa";

// Placeholder Data for Team Members (Affiliated employees in the same company)
const initialTeamMembers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@company.com",
    role: "Frontend Developer",
    team: "Development",
    assets: 3,
  },
  {
    id: 2,
    name: "Bob Kellar",
    email: "bob@company.com",
    role: "Backend Engineer",
    team: "Development",
    assets: 1,
  },
  {
    id: 3,
    name: "Eve Barton",
    email: "eve@company.com",
    role: "Product Manager",
    team: "Product",
    assets: 0,
  },
  {
    id: 4,
    name: "Mark Wilson",
    email: "mark@company.com",
    role: "UX Designer",
    team: "Design",
    assets: 2,
  },
];

const MyTeam = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState("All");

  const availableTeams = ["All", "Development", "Product", "Design"];

  // Filter members based on search term and team filter
  const filteredMembers = initialTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filterTeam === "All" || member.team === filterTeam;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="p-4 md:p-8 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
        <FaUsers className="text-secondary" /> My Team / Colleagues
      </h1>
      <p className="text-gray-500 mb-6">
        Connect with affiliated colleagues in your organization.
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
              placeholder="Search colleague by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        {/* Filter by Team */}
        <div className="flex items-center gap-2">
          <FaBriefcase className="text-secondary" />
          <select
            className="select select-bordered w-full max-w-xs"
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
          >
            {availableTeams.map((team) => (
              <option key={team} value={team}>
                {team} Team
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Member Cards (Grid View) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="card bg-base-100 shadow-xl border-t-4 border-primary hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="card-body items-center text-center p-6">
                {/* Avatar Placeholder */}
                <FaUserCircle className="w-16 h-16 text-primary mb-3" />

                <h2 className="card-title text-secondary text-lg">
                  {member.name}
                </h2>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {member.role}
                </p>

                <div className="flex flex-col items-start w-full text-left space-y-1 mt-2">
                  <div className="text-sm flex items-center gap-2 text-base-content">
                    <FaEnvelope className="w-4 h-4 text-primary opacity-80" />{" "}
                    {member.email}
                  </div>
                  <div className="text-sm flex items-center gap-2 text-base-content">
                    <FaTag className="w-4 h-4 text-primary opacity-80" /> Team:
                    **{member.team}**
                  </div>
                  <div className="text-xs text-info font-bold mt-1">
                    Assigned Assets: {member.assets}
                  </div>
                </div>

                <div className="card-actions justify-end mt-4 w-full">
                  {/* Action button (e.g., Send Message, View Contact) */}
                  <a
                    href={`mailto:${member.email}`}
                    className="btn btn-sm btn-outline btn-primary btn-block"
                  >
                    Contact Colleague
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">
              No team members found matching your criteria in the **{filterTeam}
              ** team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
