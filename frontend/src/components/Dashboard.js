import React from "react";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-container">
      <h1>Welcome to My Project</h1>
      <p className="dashboard-welcome">
        {user ? `Hello, ${user.name}!` : "Please log in to see your dashboard."}
      </p>
    </div>
  );
};

export default Dashboard;
