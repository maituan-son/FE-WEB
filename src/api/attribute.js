import api from ".";
export const getAttributes = () => api.get(`/attributes`);
export const createAttribute = (data) => api.post("/attributes", data);
export const getAttribute = (id) => api.get(`/attributes/${id}`);
export const updateAttribute = (id, data) =>
  api.patch(`/attributes/${id}`, data);
export const deleteAttribute = (id) => api.delete(`/attributes/${id}`);
export const softDeleteAttribute = (id) =>
  api.patch(`/attributes/soft-delete/${id}`, { deletedAt: new Date() });
export const restoreAttribute = (id) =>
  api.patch(`/attributes/restore/${id}`, { deletedAt: null });
