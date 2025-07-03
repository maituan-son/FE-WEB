import api from ".";
import qs from "query-string";
export const getCategories = (params) =>
  api.get(`/categories?${qs.stringify(params)}`);
export const createCategory = (data) => api.post("/categories", data);
export const getCategory = (id) => api.get(`/categories/${id}`);
export const updateCategory = (id, data) =>
  api.patch(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const softDeleteCategory = (id) =>
  api.patch(`/categories/soft-delete/${id}`, { deletedAt: new Date() });
export const restoreCategory = (id) =>
  api.patch(`/categories/restore/${id}`, { deletedAt: null });
