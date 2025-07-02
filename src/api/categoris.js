import api from ".";

export const getCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);
export const getCategory = (id) => api.get(`/categories/${id}`);
export const updateCategory = (id, data) =>
  api.patch(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const sotftDeleteCategory = (id) =>
  api.patch(`/categories/${id}`, { deleteAt: true });
export const restoreCategory = (id) =>
  api.patch(`/categories/${id}`, { deleteAt: false });
