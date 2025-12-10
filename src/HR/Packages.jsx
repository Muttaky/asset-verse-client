import React from "react";
import { Link, useLoaderData } from "react-router";

const Packages = () => {
  let packagesData = useLoaderData();
  return (
    <div>
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
                {pkg.name !== "Basic" && (
                  <Link
                    to="/join-hr"
                    className={`btn btn-secondary} btn-block mt-6 transition-transform duration-300 hover:scale-105`}
                  >
                    Start with {pkg.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Packages;
