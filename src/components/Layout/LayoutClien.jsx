import { Outlet } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";

const LayoutClient = () => {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default LayoutClient;
