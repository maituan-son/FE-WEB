import api from ".";
import qs from "query-string";
export const getProducts = (params) =>
  api.get(`/products?${qs.stringify(params)}`);
export const createProduct = (data) => api.post("/products", data);
export const getProduct = (id) => api.get(`/products/${id}`);
export const updateProduct = (id, data) => api.patch(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const softDeleteProduct = (id) =>
  api.patch(`/products/soft-delete/${id}`, { deletedAt: new Date() });
export const restoreProduct = (id) =>
  api.patch(`/products/restore/${id}`, { deletedAt: null });
