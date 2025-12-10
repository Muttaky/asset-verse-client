import React from "react";
import { Link, useLoaderData } from "react-router";
import useAuth from "./useAuth";

// Using react-icons for professional, consistent iconography
import {
  FaBoxes,
  FaUsers,
  FaChartLine,
  FaShieldAlt,
  FaWarehouse,
  FaHandshake,
} from "react-icons/fa";

const benefitsData = [
  {
    icon: FaBoxes,
    title: "Complete Accountability",
    description:
      "Track every physical asset from assignment to return, eliminating loss and improving inventory accuracy.",
    color: "text-primary",
  },
  {
    icon: FaUsers,
    title: "Streamlined HR Workflow",
    description:
      "Automate asset requests, approvals, and affiliation, reducing administrative overhead for HR.",
    color: "text-secondary",
  },
  {
    icon: FaChartLine,
    title: "Clear Inventory Visibility",
    description:
      "Get real-time insights into your available, assigned, returnable, and non-returnable assets.",
    color: "text-info",
  },
  {
    icon: FaShieldAlt,
    title: "Secure & Role-Based Access",
    description:
      "Separate dashboards and permissions ensure HR and employees only see relevant data.",
    color: "text-success",
  },
];

const Home = () => {
  let { user } = useAuth();
  const packagesData = useLoaderData();

  return (
    <div className="min-h-screen">
      <section className="hero bg-base-100 min-h-[85vh] py-16">
        <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-7xl mx-auto px-4">
          {/* Hero Image (Corporate Imagery) */}
          {/* Note: The actual Framer Motion implementation (like motion.div) is omitted, but the structure is ready. */}
          <div
            className="lg:w-1/2 w-full mb-8 lg:mb-0 relative"
            // Placeholder for Framer Motion animation properties (e.g., initial, animate, transition)
          >
            <img
              src="https://velosiaims.com/wp-content/uploads/2022/07/asset-mgmt-scaled.jpg"
              className="w-full rounded-2xl shadow-2xl object-cover aspect-video"
              alt="Professional corporate setting showing asset management"
            />
            <div className="absolute inset-0 bg-primary/10 rounded-2xl"></div>
          </div>

          {/* Hero Content (Value Proposition Headline) */}
          <div
            className="lg:w-1/2 w-full lg:pr-12"
            // Placeholder for Framer Motion animation properties
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Manage Your <span className="text-primary">Corporate Assets</span>
              , Effortlessly.
            </h1>
            <p className="py-6 text-lg text-gray-600">
              AssetVerse is the comprehensive digital platform that helps
              companies efficiently manage physical equipment and track employee
              assignments, ensuring zero loss and total accountability.
            </p>
            {!user ? (
              <div className="flex space-x-4">
                <Link
                  to="/hr-reg"
                  className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Join as HR Manager
                </Link>
                <Link
                  to="/ep-reg"
                  className="btn btn-secondary btn-outline btn-lg hover:bg-secondary hover:text-white transition-all duration-300"
                >
                  Join as Employee
                </Link>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </section>
      <hr className="w-4/5 mx-auto border-t border-base-300" />
      <section id="about" className="py-20 bg-base-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-secondary mb-3">
            Why Choose AssetVerse?
          </h2>
          <p className="text-lg text-gray-500 mb-12">
            The smart way to handle your most valuable business resources.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitsData.map((item, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl p-6 transition-transform duration-500 hover:scale-[1.03] border-t-4 border-primary/50"
              >
                <div className="flex justify-center mb-4">
                  <item.icon className={`h-12 w-12 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <hr className="w-4/5 mx-auto border-t border-base-300" />

      <section id="packages" className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-3">
            Subscription Packages
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Choose the plan that fits your company's growing needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packagesData.map((pkg) => (
              <div
                key={pkg._id}
                className={`card shadow-2xl p-8 flex flex-col justify-between 
                  bg-base-200
                `}
              >
                <div>
                  <h3 className={`text-3xl font-bold mb-2 text-primary`}>
                    {pkg.name}
                  </h3>
                  {pkg.isRecommended && (
                    <div className="badge badge-primary mb-4 text-white">
                      Most Popular
                    </div>
                  )}

                  <div className="text-5xl font-extrabold my-4">
                    ${pkg.price}
                    <span className="text-lg font-normal text-gray-500">
                      /mo
                    </span>
                  </div>

                  <p className="text-lg font-semibold text-gray-700 mb-6">
                    Up to{" "}
                    <span className="text-primary font-bold">
                      {pkg.employeeLimit}
                    </span>{" "}
                    Employees
                  </p>

                  <ul className="text-left space-y-3 mb-8">
                    {pkg.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="flex items-center text-gray-700"
                      >
                        <svg
                          className="h-5 w-5 mr-3 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/pack"
                  className={`btn btn-secondary} btn-block mt-6 transition-transform duration-300 hover:scale-105`}
                >
                  Start with {pkg.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-secondary mb-12">
            Powerful Features Built for HR
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={FaWarehouse}
              title="Inventory Management"
              description="Add, track, and manage all company assets in one centralized inventory."
            />
            <FeatureCard
              icon={FaHandshake}
              title="Employee Affiliation"
              description="Automatic affiliation and management for employees upon asset approval."
            />
            <FeatureCard
              icon={FaBoxes}
              title="Asset Request Workflow"
              description="Streamlined approval process for employee asset requests and tracking."
            />
            <FeatureCard
              icon={FaChartLine}
              title="Usage Analytics"
              description="Get visual data on asset distribution and top requested items."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple reusable Feature Card component for consistency
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-base-200 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
    <Icon className="h-10 w-10 text-primary mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Home;
