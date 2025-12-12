import React, { useEffect, useState } from "react";
import { Link } from "react-router"; // Assuming useLoaderData and Link are from react-router-dom
import useAuth from "../useAuth"; // Assuming your authentication hook
import useAxiosSecure from "../useAxiosSecure";
const Packages = () => {
  let axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // Get current HR user
  let [packages, setPackages] = useState([]);
  useEffect(() => {
    axiosSecure(`/packages`).then((data) => {
      setPackages(data.data);
    });
  }, []);
  let packagesData = packages;
  const handleCheckout = (pkg) => {
    // Collect data needed for Stripe checkout
    const paymentInfo = {
      packageName: pkg.name,
      price: pkg.price, // Assumes price is in USD
      employeeLimit: pkg.employeeLimit,
      hrEmail: user.email, // Use the logged-in user's email
    };

    axiosSecure
      .post(`http://localhost:3000/create-checkout-session`, paymentInfo)
      .then((data) => {
        if (data.data.url) {
          // Redirect to Stripe Checkout page
          window.location.replace(data.data.url);
        }
      })
      .catch((error) => {
        console.error("Stripe Checkout Error:", error);
        alert("Could not initiate payment. Please try again.");
      });
  };

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
                  bg-base-100 ${
                    pkg.isRecommended ? "border-4 border-secondary" : ""
                  }
                `}
              >
                <div>
                  <h3 className={`text-3xl font-bold mb-2 text-primary`}>
                    {pkg.name}
                  </h3>
                  {pkg.isRecommended && (
                    <div className="badge badge-secondary mb-4 text-white">
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
                        {/* Checkmark SVG */}
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

                {/* Conditional Purchase Button */}
                {pkg.price === 0 ? (
                  // Free Basic Package (Link/Button for HR sign-up)
                  <Link
                    to="/join-hr"
                    className={`btn btn-primary btn-block mt-6 transition-transform duration-300 hover:scale-105`}
                  >
                    Start with {pkg.name}
                  </Link>
                ) : (
                  // Paid Package (Stripe Checkout Handler)
                  <button
                    onClick={() => handleCheckout(pkg)}
                    className={`btn btn-secondary btn-block mt-6 transition-transform duration-300 hover:scale-105`}
                  >
                    Upgrade to {pkg.name}
                  </button>
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
