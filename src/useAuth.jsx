import React, { use } from "react";
import { AuthContext } from "./AuthContext";

const useAuth = () => {
  let authInfo = use(AuthContext);
  return authInfo;
};

export default useAuth;
