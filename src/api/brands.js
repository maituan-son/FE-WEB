import api from ".";
import qs from "query-string";
export const getBrands = (params) => api.get(`/brands?${qs.stringify(params)}`);
export const createBrand = (data) => api.post("/brands", data);
export const getBrand = (id) => api.get(`/brands/${id}`);
export const updateBrand = (id, data) => api.patch(`/brands/${id}`, data);
export const deleteBrand = (id) => api.delete(`/brands/${id}`);
export const softDeleteBrand = (id) =>
  api.patch(`/brands/soft-delete/${id}`, { deletedAt: new Date() });
export const restoreBrand = (id) =>
  api.patch(`/brands/restore/${id}`, { deletedAt: null });
