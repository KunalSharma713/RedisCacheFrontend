import React, { useState } from "react";
import ProductTable from "./components/ProductTable";
import AddProductForm from "./components/AddProductForm";
import Sidebar from "./components/Sidebar";
import Login from "./Login";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState('all-products');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleProductAdded = () => {
    setActiveView('all-products');
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setActiveView('all-products');
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} onLogout={handleLogout} />
      <main className="main-content">
        {activeView === 'all-products' && (
          <div className="table-header">
            <h2>Product Data Table</h2>
          </div>
        )}
        {activeView === 'all-products' && <ProductTable />}
        {activeView === 'add-product' && <AddProductForm onProductAdded={handleProductAdded} />}
      </main>
    </div>
  );
}

export default App;
