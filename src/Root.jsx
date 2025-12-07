import React from "react";
import { Outlet, useLoaderData } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
const Root = () => {
  const users = useLoaderData();
  return (
    <div>
      <Header users={users}></Header>
      <Outlet></Outlet>
      <Footer></Footer>
      <ToastContainer />
    </div>
  );
};

export default Root;
