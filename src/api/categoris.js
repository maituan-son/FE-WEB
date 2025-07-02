import { date } from "zod";
import api from ".";

export const getCategories = (queryString) =>
  api.get(`/categories${queryString}`);
export const createCategory = (data) => api.post("/categories", data);
export const getCategory = (id) => api.get(`/categories/${id}`);
export const updateCategory = (id, data) =>
  api.patch(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const softDeleteCategory = (id) =>
  api.patch(`/categories/soft-delete/${id}`, { deletedAt: new Date() });
export const restoreCategory = (id) =>
  api.patch(`/categories/restore/${id}`, { deletedAt: null });
