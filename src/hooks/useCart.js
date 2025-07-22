import { useState, useEffect } from "react";
import { getCart } from "../api/carts";

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) {
        setCartItems([]);
        setCartCount(0);
        setLoading(false);
        return;
      }

      const authData = JSON.parse(authStorage);
      const token = authData.state?.token;

      if (!token) {
        setCartItems([]);
        setCartCount(0);
        setLoading(false);
        return;
      }

      const response = await getCart();
      const items = response.data?.items || [];

      setCartItems(items);
      // Tính tổng số lượng sản phẩm trong giỏ hàng
      const totalCount = items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartCount(totalCount);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
      setCartCount(0);
      setLoading(false);
    }
  };

  const refreshCart = () => {
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cartItems,
    cartCount,
    loading,
    refreshCart,
  };
};

export default useCart;
