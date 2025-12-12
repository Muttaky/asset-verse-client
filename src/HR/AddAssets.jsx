import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../useAuth";
import useAxiosSecure from "../useAxiosSecure";
const AddAssets = () => {
  let { user } = useAuth();

  let axiosSecure = useAxiosSecure();
  let [users, setUsers] = useState([]);
  useEffect(() => {
    axiosSecure(`/users`).then((data) => {
      setUsers(data.data);
    });
  }, []);
  let newUser = users.find((u) => u.email === user.email);

  const navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let handleRegister = (data) => {
    //imageBB start
    const image = data.photo[0];
    const formData = new FormData();
    formData.append("image", image);
    const image_API = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_host
    }`;
    axios.post(image_API, formData).then((res) => {
      console.log("after image upoad", res.data.data.url);

      //DB start
      const today = new Date().toISOString().split("T")[0];
      const newAsset = {
        photo: res.data.data.url,
        name: data.name,
        type: data.type,
        quantity: data.pq,
        availableQuantity: data.pq,
        createdAt: today,
        companyName: newUser.companyName,
        email: user.email,
      };
      axiosSecure.post("/assets", newAsset).then((data) => {
        console.log("after post asset", data.data);
        if (data.data.insertedId) {
          toast("asset added successfully");
        }
      });

      navigate("/assets-list");
    });
  };
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-primary">Add Assets</h1>
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
                  <label className="label">Product Type</label>

                  <div className="flex gap-4">
                    {/* Returnable */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="returnable"
                        {...register("type")}
                        className="radio radio-secondary"
                      />
                      <span>Returnable</span>
                    </label>

                    {/* Non-returnable */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="non-returnable"
                        {...register("type")}
                        className="radio radio-secondary"
                      />
                      <span>Non-returnable</span>
                    </label>
                  </div>

                  <label className="label">productName</label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    className="input"
                    placeholder="productName"
                  />
                  <label className="label">productQuantity</label>
                  <input
                    {...register("pq", { required: true })}
                    type="number"
                    className="input"
                    placeholder="productQuantity"
                  />

                  <button className="btn btn-primary mt-4">Add Assets</button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssets;
