import React, { useState, useEffect } from "react";
import { 
  getCategories, 
  createCategory, 
  deleteCategory, 
  getCategory, 
  restoreCategory, 
  
} from "../../../api/categoris";

const ListCategoris = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

 const fetchCategories = async () => {
  setLoading(true);
  try {
    const data = await getCategories();
    console.log("Fetched categories:", data.data);
    // Ensure categories is an array before setting state
    if (Array.isArray(data.data.data)) {
      setCategories(data.data.data);
      console.log("Categories fetched successfully:", data.data.data);

    } else {
      setCategories([]);
      console.error("Expected categories to be an array but got:", data.data);
    }
  } catch {
    setError("Failed to fetch categories");
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Category title is required");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        // Update category
        await createCategory({ id: editingId, ...formData }); // Assuming createCategory handles update if id exists
        setMessage("Category updated successfully");
      } else {
        // Create new category
        await createCategory(formData);
        setMessage("Category created successfully");
      }
      setFormData({ title: "", description: "" });
      setEditingId(null);
      fetchCategories();
    } catch {
      setError("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const response = await getCategory(id);
    
      
      const category = response.data;
      setFormData({ title: category.title, description: category.description });
      setEditingId(id);
      setError(null);
      setMessage(null);
    } catch {
      setError("Failed to load category for editing");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setLoading(true);
    try {
      await deleteCategory(id);
      setMessage("Category deleted successfully");
      fetchCategories();
    } catch {
      setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    setLoading(true);
    try {
      await restoreCategory(id);
      setMessage("Category restored successfully");
      fetchCategories();
    } catch {
      setError("Failed to restore category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Categories Management</h2>

      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Category Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Category Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {editingId ? "Update Category" : "Add Category"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", description: "" });
              setError(null);
              setMessage(null);
            }}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>

      {loading && <p>Loading...</p>}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Slug</th>
            <th>Status</th>
            
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No categories found.
              </td>
            </tr>
          )}
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.title}</td>
              <td>{category.description}</td>
              <td>{category.slug}</td>
              <td>{category.deleteAt ? "Deleted" : "Active"}</td>
              <td>
                {!category.deleteAt ? (
                  <>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(category._id)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(category._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleRestore(category._id)}
                    disabled={loading}
                  >
                    Restore
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCategoris;
