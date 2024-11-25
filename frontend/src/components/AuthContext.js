import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
// import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const username = localStorage.getItem("username");
    console.log(username)
    const token = localStorage.getItem("token");
    if (username && token) setUser(JSON.parse(username));
    // console.log(user)
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/login", {
        email:username,
        password,
      });
      // console.log(response)
      const { token } = response.data;
      const loggedInUser=response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("username", JSON.stringify(loggedInUser));
      // console.log(loggedInUser)
      setUser(loggedInUser);
      window.location.href = "/";
      // console.log(user,loggedInUser)
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  const signup = async (username, password, email, phone) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/register", {
        name:username,
        email,
        password,
        phone,
      });
      console.log(response)
      const { token } = response.data;
      const loggedInUser=response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("username", loggedInUser);
      console.log(loggedInUser)
      setUser(loggedInUser);
      console.log(user,loggedInUser)
      alert("Signup successful");
      window.location.href = "/";
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed: " + error.response?.data?.message || "Unknown error");
    }
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
