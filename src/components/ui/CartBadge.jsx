import React from "react";

const CartBadge = ({ count, className = "" }) => {
  if (count === 0) {
    return (
      <span
        className={`absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${className}`}
      >
        0
      </span>
    );
  }

  return (
    <span
      className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default CartBadge;
