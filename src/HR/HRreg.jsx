import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../useAuth";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Register = () => {
  let { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let handleRegister = (data) => {
    console.log(data);
    const image = data.photo[0];
    const today = new Date().toISOString().split("T")[0];
    const newUser = {
      role: "hr",
      name: data.name,
      email: data.email,
      dob: data.dob,
      createdAt: today,
      updatedAt: today,
      companyName: data.companyName,
      packageLimit: 5,
      currentEP: 0,
      subscribtion: "basic",
    };
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("after post user", data);
        if (data.insertedId) {
          toast("user added successfully");
        }
      });
    registerUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        const formData = new FormData();
        formData.append("image", image);
        const image_API = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host
        }`;
        axios.post(image_API, formData).then((res) => {
          console.log("after image upoad", res.data.data.url);
          const userProfile = {
            displayName: data.name,
            photoURL: res.data.data.url,
          };
          updateUserProfile(userProfile)
            .then(() => {
              console.log("user profile updated");
            })
            .catch((error) => console.log(error));
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Join as HR Manager</h1>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit(handleRegister)}>
                <fieldset className="fieldset">
                  <label className="label">Photo</label>
                  <input
                    {...register("photo", { required: true })}
                    type="file"
                    className="file-input"
                    placeholder="Photo"
                  />
                  <label className="label">Name</label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    className="input"
                    placeholder="Name"
                  />
                  <label className="label">dateOfBirth</label>
                  <input
                    {...register("dob", { required: true })}
                    type="date"
                    className="input"
                  />
                  <label className="label">companyName</label>
                  <input
                    {...register("companyName", { required: true })}
                    type="text"
                    className="input"
                    placeholder="companyName"
                  />
                  <label className="label">Email</label>
                  <input
                    {...register("email", { required: true, minLength: 6 })}
                    type="email"
                    className="input"
                    placeholder="Email"
                  />
                  {errors.email?.type === "required" && (
                    <p className="text-red-500">Email is required</p>
                  )}
                  <label className="label">Password</label>
                  <input
                    {...register("password", {
                      required: true,
                      minLength: 6,
                      pattern:
                        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                    })}
                    type="password"
                    className="input"
                    placeholder="Password"
                  />
                  {errors.password?.type === "required" && (
                    <p className="text-red-500">password is required</p>
                  )}
                  {errors.password?.type === "minLength" && (
                    <p className="text-red-500">
                      minimum 6 character is required
                    </p>
                  )}
                  {errors.password?.type === "pattern" && (
                    <p className="text-red-500">
                      password must have one uppercase , one lowercase ,one
                      number and one special character
                    </p>
                  )}
                  <div>
                    <a className="link link-hover">Forgot password?</a>
                  </div>
                  <button className="btn btn-neutral mt-4">Login</button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
