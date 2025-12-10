import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase.init";

const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(null);
  let [loading, setLoading] = useState(true);
  let registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  let loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  let logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  let updateUserProfile = (profile) => {
    setLoading(true);
    return updateProfile(auth.currentUser, profile);
  };
  useEffect(() => {
    let unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const [affiliations, setAffiliations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/affiliations")
      .then((res) => res.json())
      .then((data) => setAffiliations(data));
  }, []);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data));
  }, []);
  const [assigneds, setAssigneds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/assigneds")
      .then((res) => res.json())
      .then((data) => setAssigneds(data));
  }, []);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/packages")
      .then((res) => res.json())
      .then((data) => setPackages(data));
  }, []);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  let authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    logOut,
    updateUserProfile,
    affiliations,
    assets,
    assigneds,
    packages,
    requests,
    users,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
