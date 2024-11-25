import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const {  user,logout } = useContext(AuthContext);
  // const user=null

  console.log(user)
  // console.log(JSON.parse(localStorage.getItem("username")));
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          My Project Title
        </Link>
        <div className="navbar-links">
          {user.name ? (
            <>
              <span className="navbar-user">{user?.name}</span>
              <button className="navbar-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="navbar-link" to="/login">
                Login
              </Link>
              <Link className="navbar-link" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
