import api from ".";
export const getListProductVariant = () => api.get(`/product-variants`);
export const createProductVariant = (data) =>
  api.post("/product-variants", data);
export const getProductVariant = (id) => api.get(`/product-variants/${id}`);
export const updateProductVariant = (id, data) =>
  api.patch(`/product-variants/${id}`, data);
export const deleteProductVariant = (id) =>
  api.delete(`/product-variants/${id}`);
export const softDeleteProductVariant = (id) =>
  api.patch(`/product-variants/soft-delete/${id}`, { deletedAt: new Date() });
export const restoreProductVariant = (id) =>
  api.patch(`/product-variants/restore/${id}`, { deletedAt: null });
