import React, { useState, useEffect } from "react";
import "./ProductTable.css";
import axios from "axios";
import EditProductForm from "./EditProductForm";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const rowsPerPage = 15;

  const fetchProducts = async (page = 1, search = "", sort = "createdAt", order = "desc") => {
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

  const handleEdit = (product) => {
    setEditingProduct(product._id);
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
  };

  const handleProductUpdated = () => {
    fetchProducts(currentPage, searchTerm, sortBy, sortOrder);
  };

  const handleDelete = (product) => {
    setDeleteConfirm(product);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    setActionLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${deleteConfirm._id}`);
      setDeleteConfirm(null);
      fetchProducts(currentPage, searchTerm, sortBy, sortOrder);
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      console.error("Error deleting product:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
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
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="loading-cell">
                  <div className="table-loading">
                    <div className="spinner"></div>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data-cell">
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
                    <span className="category-badge">
                      {product.category}
                    </span>
                  </td>
                  <td className="created-cell">
                    {product.createdAt ? new Date(product.createdAt).toLocaleString() : '-'}
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(product)}
                        className="edit-button"
                        title="Edit product"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="delete-button"
                        title="Delete product"
                      >
                        Delete
                      </button>
                    </div>
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductForm
          productId={editingProduct}
          onClose={handleCloseEdit}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-container">
            <div className="delete-confirm-header">
              <h3>Confirm Delete</h3>
              <button className="close-button" onClick={cancelDelete}>×</button>
            </div>
            
            <div className="delete-confirm-content">
              <p>Are you sure you want to delete this product?</p>
              <div className="product-preview">
                <strong>{deleteConfirm.name}</strong>
                <br />
                Price: ${deleteConfirm.price.toFixed(2)} | Category: {deleteConfirm.category}
              </div>
            </div>

            <div className="delete-confirm-actions">
              <button
                onClick={cancelDelete}
                className="cancel-delete-button"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="confirm-delete-button"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <span className="spinner"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
