import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const UpgradeSuccess = () => {
  const [message, setMessage] = useState(
    "Verifying payment and updating your account..."
  );
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const hrEmail = query.get("email");
    const employeeLimit = query.get("limit");
    const sessionId = query.get("session_id");

    if (sessionId && hrEmail && employeeLimit) {
      // Send request to update the HR user's packageLimit
      fetch(`http://localhost:3000/hr-limit/${hrEmail}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeLimit: Number(employeeLimit) }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            setMessage(
              `Success! Your account has been upgraded to ${employeeLimit} employee slots. You can now add more employees.`
            );
          } else {
            setMessage(
              "Payment verified, but failed to update account in database. Please contact support."
            );
            console.error("DB Update failed:", data);
          }
        })
        .catch((error) => {
          setMessage(
            "An error occurred during account update. Please check your HR Dashboard."
          );
          console.error("Account update error:", error);
        });
    } else {
      setMessage("Invalid transaction or missing payment details.");
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-secondary mb-4">
          Upgrade Status
        </h2>
        <p className="text-lg text-gray-700">{message}</p>
        <Link to="/hr-dash" className="btn btn-primary mt-6">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UpgradeSuccess;
