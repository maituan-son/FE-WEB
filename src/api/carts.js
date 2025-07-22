import api from ".";

// Lấy giỏ hàng - Backend dùng req.user từ token, không cần userId trong URL
export const getCart = async () => {
  const response = await api.get(`/carts`);
  return response.data;
};

export const addToCart = async (data) => {
  const response = await api.post("/carts/cart", data);
  return response.data;
};

export const updateCartItem = async (itemId, data) => {
  const res = await api.put(`/carts/item/${itemId}`, data);
  return res.data;
};

export const deleteCartItem = async (id) => {
  const response = await api.delete(`/carts/${id}`);
  return response.data;
};
