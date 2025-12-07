import { useForm } from "react-hook-form";

import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const Login = () => {
  let { loginUser } = useAuth();
  const navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let handleRegister = (data) => {
    console.log(data);
    loginUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
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
            <h1 className="text-5xl font-bold">Login now!</h1>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit(handleRegister)}>
                <fieldset className="fieldset">
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

export default Login;
