import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCart, updateCartItem, deleteCartItem } from "../../api/carts";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useCartContext } from "../../hooks/useCartContext";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const { refreshCart } = useCartContext();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      console.log("🛒 Starting to fetch cart...");

      const authStorage = localStorage.getItem("auth-storage");
      console.log("📦 Auth storage:", authStorage ? "Found" : "Not found");

      if (!authStorage) {
        console.log("❌ No auth storage found");
        setError("Please login to view cart");
        setLoading(false);
        return;
      }

      const authData = JSON.parse(authStorage);
      console.log("🔍 Auth data structure:", authData);

      const token = authData.state?.token;

      console.log("🔑 Token:", token ? "Found" : "Not found");

      if (!token) {
        console.log("❌ No token found");
        setError("Token not found, please login again");
        setLoading(false);
        return;
      }

      console.log("� Making API call to get cart...");
      const response = await getCart(); // Backend tự lấy user từ token
      console.log("✅ Cart response:", response);

      // Backend trả về { message, data: cart }
      // cart.items là array các item trong giỏ hàng
      setCartItems(response.data?.items || []);
      setLoading(false);
      console.log("🎉 Cart loaded successfully");
    } catch (err) {
      console.error("💥 Fetch cart error:", err);
      console.error("💥 Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      if (err.response?.status === 401) {
        setError("Session expired, please login again");
      } else if (err.response?.status === 404) {
        setError("Cart not found - cart is empty");
        setCartItems([]); // Set empty cart instead of error for 404
        setLoading(false);
        return;
      } else {
        setError(
          `Failed to fetch cart: ${err.response?.data?.message || err.message}`
        );
      }
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) return;

      await updateCartItem(productId, { quantity: newQuantity });
      toast.success("Cập nhật giỏ hàng thành công");
      fetchCart(); // Refresh lại giỏ hàng
      refreshCart(); // Refresh header cart count
    } catch (err) {
      console.error("Update cart error:", err);
      if (err.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      } else {
        toast.error("Không thể cập nhật giỏ hàng");
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      toast.success("Item removed from cart");
      fetchCart();
      refreshCart(); // Refresh header cart count
    } catch (err) {
      console.error("Remove item error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
      } else {
        toast.error("Failed to remove item");
      }
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(
        item.product?.currentPrice || item.product?.priceDefault || 0
      );
      return total + price * item.quantity;
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 10;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePromoCodeApply = () => {
    if (promoCode.trim()) {
      toast.info("Promo code feature coming soon!");
    }
  };

  // Debug function to check auth status
  const debugAuth = () => {
    const authStorage = localStorage.getItem("auth-storage");
    console.log("🔍 DEBUG - Auth Storage:", authStorage);

    if (authStorage) {
      try {
        const authData = JSON.parse(authStorage);
        console.log("🔍 DEBUG - Parsed Auth Data:", authData);

        const token = authData.state?.token;
        const user = authData.state?.user;

        console.log("🔍 DEBUG - Token:", token);
        console.log("🔍 DEBUG - User:", user);

        if (token) {
          try {
            const decoded = jwtDecode(token);
            console.log("🔍 DEBUG - Decoded Token:", decoded);
          } catch (err) {
            console.log("❌ DEBUG - Token decode error:", err);
          }
        }

        toast.info("Check console for debug info");
      } catch (err) {
        console.log("❌ DEBUG - Parse error:", err);
      }
    } else {
      console.log("❌ DEBUG - No auth storage found");
      toast.error("No authentication data found");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your cart...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-red-600 mb-6 font-medium">{error}</p>

            {/* Debug Button */}
            <button
              onClick={debugAuth}
              className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors mr-4"
            >
              🔍 Debug Auth Info
            </button>

            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <section className="relative bg-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Review your selected items and proceed to checkout
            </p>
            <nav className="flex justify-center items-center space-x-3 text-white/80">
              <Link
                to="/"
                className="hover:text-white transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-white font-semibold">Cart</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-2xl mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Your cart is empty
                </h2>
                <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
                  Discover amazing products and start your shopping journey with
                  us.
                </p>

                {/* Debug Button */}
                <button
                  onClick={debugAuth}
                  className="mb-6 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  🔍 Debug Auth Info
                </button>

                <Link
                  to="/shop"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Cart Items */}
              <div className="xl:col-span-3">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <svg
                          className="w-8 h-8 mr-3 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        Cart Items
                      </h2>
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="p-8 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="flex-shrink-0 relative group">
                            <img
                              src={item.product?.thumbnail}
                              alt={item.product?.title}
                              className="w-24 h-24 object-cover rounded-2xl ring-4 ring-gray-100 group-hover:ring-blue-200 transition-all duration-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-200"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 truncate mb-2">
                              {item.product?.title}
                            </h3>
                            <div className="flex flex-wrap gap-3 mb-4">
                              {item.size && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m3 0H4a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z"
                                    />
                                  </svg>
                                  {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                  <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{
                                      backgroundColor: item.color.toLowerCase(),
                                    }}
                                  ></div>
                                  {item.color}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item._id,
                                        item.quantity - 1
                                      )
                                    }
                                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-sm"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4"
                                      />
                                    </svg>
                                  </button>
                                  <span className="w-16 text-center text-gray-900 font-bold text-lg">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item._id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-all duration-200 shadow-sm"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 mb-2">
                                  $
                                  {(
                                    Number(
                                      item.product?.currentPrice ||
                                        item.product?.priceDefault ||
                                        0
                                    ) * item.quantity
                                  ).toLocaleString()}
                                </p>
                                <button
                                  onClick={() => handleRemoveItem(item._id)}
                                  className="inline-flex items-center text-sm text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-all duration-200"
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order Summary
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Subtotal
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        ${calculateSubtotal().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                          />
                        </svg>
                        Shipping
                      </span>
                      <span className="font-bold">
                        {calculateShipping() === 0 ? (
                          <span className="text-green-600 flex items-center">
                            <svg
                              className="w-5 h-5 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Free
                          </span>
                        ) : (
                          <span className="text-gray-900">
                            `$${calculateShipping()}`
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">
                          Total
                        </span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <Link
                      to="/checkout"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl text-center flex items-center justify-center"
                    >
                      <svg
                        className="w-6 h-6 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Proceed to Checkout
                    </Link>
                    <Link
                      to="/shop"
                      className="w-full border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-2xl font-bold hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center flex items-center justify-center"
                    >
                      <svg
                        className="w-6 h-6 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16l-4-4m0 0l4-4m-4 4h18"
                        />
                      </svg>
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Enhanced Promo Code */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Promo Code
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                      />
                      <button
                        onClick={handlePromoCodeApply}
                        className="absolute right-2 top-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Enter a valid promo code for discounts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modern Footer Section */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Security */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Secure Payment
                </h3>
                <p className="text-white/70">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>

            {/* Free Shipping */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Free Shipping
                </h3>
                <p className="text-white/70">
                  Free shipping on orders over $100
                </p>
              </div>
            </div>

            {/* Support */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  24/7 Support
                </h3>
                <p className="text-white/70">
                  Always here to help you with any questions
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-12 pt-8 border-t border-white/20 text-center">
            <p className="text-white/60">
              © 2024 Your Store. Made with ❤️ for amazing shopping experience
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
export default CartPage;
