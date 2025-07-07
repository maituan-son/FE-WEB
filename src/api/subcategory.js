import api from ".";
import qs from "query-string";

export const getSubCategories = (params) =>
  api.get(`/subcategories?${qs.stringify(params)}`);

export const createSubCategory = (data) => api.post("/subcategories", data);

export const getSubCategory = (id) => api.get(`/subcategories/${id}`);

export const updateSubCategory = (id, data) =>
  api.patch(`/subcategories/${id}`, data);

export const deleteSubCategory = (id) => api.delete(`/subcategories/${id}`);

export const softDeleteSubCategory = (id) =>
  api.patch(`/subcategories/soft-delete/${id}`, { deletedAt: new Date() });

export const restoreSubCategory = (id) =>
  api.patch(`/subcategories/restore/${id}`, { deletedAt: null });
