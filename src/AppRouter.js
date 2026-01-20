import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProductTable from "./components/ProductTable";
import AddProductForm from "./components/AddProductForm";
import Sidebar from "./components/Sidebar";
import Login from "./Login";
import "./App.css";

const AppRouter = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Remove activeView, use routes only
  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => setLoggedIn(false);

  return (
    <BrowserRouter>
      <Routes>
        {!loggedIn ? (
          <Route path="/*" element={<Login onLogin={handleLogin} />} />
        ) : (
          <Route path="/" element={<SidebarLayout onLogout={handleLogout} />}> 
            <Route index element={<Navigate to="/home" />} />
            <Route path="home" element={<HomePage />} />
            <Route path="list" element={<ProductTable />} />
            <Route path="add" element={<AddProductForm onProductAdded={() => {}} />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

function SidebarLayout({ onLogout }) {
  const navigate = useNavigate();
  return (
    <div className="app">
      <Sidebar
        onViewChange={(view) => {
          if (view === 'list') navigate('/list');
          else if (view === 'add') navigate('/add');
          else if (view === 'home') navigate('/home');
        }}
        onLogout={onLogout}
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

import DashboardWidgets from "./components/DashboardWidgets";

function HomePage() {
  return (
    <div className="dashboard-home">
      <div className="table-header">
        <h2>Product Catalog Dashboard</h2>
        <p>Welcome to the admin dashboard.</p>
      </div>
      <DashboardWidgets />
    </div>
  );
}

import { Outlet } from "react-router-dom";


export default AppRouter;
