import React, { useEffect, useState } from "react";
import "./DashboardWidgets.css";
import axios from "axios";

const DashboardWidgets = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    categories: 0,
    avgPrice: 0,
    latestProduct: null,
    totalValue: 0,
    lowStockProducts: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all products for accurate statistics
        const allProductsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        const allProducts = allProductsRes.data;
        
        // Use paginated API for latest product to utilize Redis cache
        // Page 1, sorted by latest created date to get the first (latest) product
        const paginatedRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/paginated?page=1&limit=15&sort=createdAt&order=desc`);
        
        const categoriesSet = new Set(allProducts.map(p => p.category));
        const avgPrice = allProducts.length > 0 ? (allProducts.reduce((sum, p) => sum + p.price, 0) / allProducts.length) : 0;
        const latestProduct = paginatedRes.data.products.length > 0 ? paginatedRes.data.products[0] : null;
        const totalValue = allProducts.reduce((sum, p) => sum + p.price, 0);
        const lowStockProducts = allProducts.filter(p => p.price < 50).length;
        const recentActivity = Math.floor(Math.random() * 50) + 10; // Simulated activity metric
        
        setStats({
          totalProducts: allProducts.length,
          categories: categoriesSet.size,
          avgPrice: avgPrice,
          latestProduct: latestProduct,
          totalValue: totalValue,
          lowStockProducts: lowStockProducts,
          recentActivity: recentActivity,
        });
      } catch {
        setStats({ totalProducts: 0, categories: 0, avgPrice: 0, latestProduct: null, totalValue: 0, lowStockProducts: 0, recentActivity: 0 });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    // In real app, this would filter data by time range
  };

  return (
    <div className="dashboard-widgets">
      {/* <div className="dashboard-header">
        <h2 className="dashboard-title">Industrial Dashboard</h2>
        <div className="dashboard-controls">
          <select 
            value={selectedTimeRange} 
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="time-range-selector"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button onClick={handleRefresh} className="refresh-button" title="Refresh Data">
           Refresh
          </button>
        </div>
      </div> */}

      <div className="widgets-grid">
        <div className="widget primary">
          <div className="widget-header">
            <div className="widget-title">Total Products</div>
          </div>
          <div className="widget-value">{stats.totalProducts.toLocaleString()}</div>
          <div className="widget-trend positive">+12.5%</div>
        </div>

        <div className="widget secondary">
          <div className="widget-header">
            <div className="widget-title">Categories</div>
          </div>
          <div className="widget-value">{stats.categories}</div>
          <div className="widget-trend neutral">+2.1%</div>
        </div>

        <div className="widget success">
          <div className="widget-header">
            <div className="widget-title">Total Value</div>
          </div>
          <div className="widget-value">${stats.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          <div className="widget-trend positive">+8.3%</div>
        </div>

        <div className="widget warning">
          <div className="widget-header">
            <div className="widget-title">Low Stock Items</div>
          </div>
          <div className="widget-value">{stats.lowStockProducts}</div>
          <div className="widget-trend negative">-5.2%</div>
        </div>

        <div className="widget info">
          <div className="widget-header">
            <div className="widget-title">Avg. Price</div>
          </div>
          <div className="widget-value">${stats.avgPrice.toFixed(2)}</div>
          <div className="widget-trend positive">+3.7%</div>
        </div>

        <div className="widget accent">
          <div className="widget-header">
            <div className="widget-title">Recent Activity</div>
          </div>
          <div className="widget-value">{stats.recentActivity}</div>
          <div className="widget-trend positive">+15.8%</div>
        </div>
      </div>

      <div className="latest-product-section">
        <div className="widget expanded">
          <div className="widget-header">
            <div className="widget-title">Latest Product</div>
          </div>
          {stats.latestProduct ? (
            <div className="latest-product-details">
              <div className="product-info">
                <div className="product-name">{stats.latestProduct.name}</div>
                <div className="product-meta">
                  <span className="price-tag">${stats.latestProduct.price.toFixed(2)}</span>
                  <span className="category-tag">{stats.latestProduct.category}</span>
                </div>
              </div>
              <div className="product-timestamp">
                <div className="timestamp-label">Added:</div>
                <div className="timestamp-value">{new Date(stats.latestProduct.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <div className="no-latest-product">
              <div>No products found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
