import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const rowsPerPage = 15;

  const fetchProducts = async (page = 1, search = "", sort = "name", order = "asc") => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString(),
        search,
        sort,
        order
      });

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/paginated?${params}`);
      
      setProducts(res.data.products);
      setTotalPages(res.data.pagination.totalPages);
      setTotalItems(res.data.pagination.totalItems);
      setCurrentPage(res.data.pagination.currentPage);
    } catch (err) {
      setError("Failed to fetch products. Please check if the backend is running.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchTerm, sortBy, sortOrder);
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getSortIcon = (field) => {
    return "";
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          First
        </button>
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <span className="pagination-ellipsis">...</span>
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            <span className="pagination-ellipsis">...</span>
          </>
        )}
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
        <button 
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Last
        </button>
      </div>
    );
  };

  if (error) {
    return (
      <div className="table-error">
        <div className="error-icon">⚠️</div>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => fetchProducts()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-table-container">
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="table-info">
          <span className="info-text">
            Showing {products.length} of {totalItems} products
          </span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort("name")}
                className="sortable-header"
              >
                Name {getSortIcon("name")}
              </th>
              <th 
                onClick={() => handleSort("price")}
                className="sortable-header"
              >
                Price {getSortIcon("price")}
              </th>
              <th>Category</th>
              <th>Tax Included</th>
              <th>Name Length</th>
              <th>Computed Score</th>
              <th>Category Avg</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="loading-cell">
                  <div className="table-loading">
                    <div className="spinner"></div>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data-cell">
                  <div className="no-data">
                    <div className="no-data-icon">📭</div>
                    <h4>No products found</h4>
                    <p>Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="table-row">
                  <td className="name-cell">
                    <div className="product-name">{product.name}</div>
                  </td>
                  <td className="price-cell">
                    <div className="price">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="category-cell">
                    {product.categoryInfo && (
                      <span className="category-badge">
                        {product.categoryInfo.category}
                      </span>
                    )}
                  </td>
                  <td className="tax-cell">
                    {product.priceWithTax && (
                      <span className="tax-amount">
                        ${product.priceWithTax.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="length-cell">
                    {product.nameLength || 0}
                  </td>
                  <td className="score-cell">
                    {product.computedField ? product.computedField.toFixed(2) : '-'}
                  </td>
                  <td className="avg-cell">
                    {product.categoryInfo?.avgPrice ? 
                      `$${product.categoryInfo.avgPrice.toFixed(2)}` : '-'
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="table-footer">
          <div className="pagination-info">
            <span>
              Page {currentPage} of {totalPages} 
              ({totalItems} total items)
            </span>
          </div>
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default ProductTable;
