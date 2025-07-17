import api from ".";
export const getListAttributeValue = () => api.get(`/attribute-values`);

export const getListAttributeValueByAttributeId = (attributeId) =>
  api.get(`/attribute-values/attribute/${attributeId}`);

export const createAttributeValue = (data) =>
  api.post("/attribute-values", data);

export const getAttributeValue = (id) => api.get(`/attribute-values/${id}`);

export const updateAttributeValue = (id, data) =>
  api.patch(`/attribute-values/${id}`, data);

export const deleteAttributeValue = (id) =>
  api.delete(`/attribute-values/${id}`);

export const softDeleteAttributeValue = (id) =>
  api.patch(`/attribute-values/soft-delete/${id}`, { deletedAt: new Date() });

export const restoreAttributeValue = (id) =>
  api.patch(`/attribute-values/restore/${id}`, { deletedAt: null });
