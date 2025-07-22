import RouterApp from "./routers";
import { RouterProvider } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";

import "./App.css";
import "./assets/css/layout.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <CartProvider>
        <RouterProvider router={RouterApp} />
        <ToastContainer />
      </CartProvider>
    </>
  );
}

export default App;
