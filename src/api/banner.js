import api from ".";
import qs from "query-string";
export const getBanners = (params) =>
  api.get(`/banners?${qs.stringify(params)}`);
export const createBanner = (data) => api.post("/banners", data);
export const getBanner = (id) => api.get(`/banners/${id}`);
export const updateBanner = (id, data) => api.patch(`/banners/${id}`, data);
export const deleteBanner = (id) => api.delete(`/banners/${id}`);
export const softDeleteBanner = (id) =>
  api.patch(`/banners/soft-delete/${id}`, { deletedAt: new Date() });
export const restoreBanner = (id) =>
  api.patch(`/banners/restore/${id}`, { deletedAt: null });
