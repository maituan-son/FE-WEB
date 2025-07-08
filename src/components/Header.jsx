import React from "react";
import useAuthStore from "./authStore/authStore";
import "../assets/css/header.module.css"; // Import your styles
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <div>
      <header>
        <div id="headerWebComponent">
          <a
            href="/"
            id="logoComponent"
            className="btn flex w-fit justify-center items-center"
          >
            <img src="./src/assets/images/logo.png" alt="Logo" />
            <span>Furniro</span>
          </a>
          <nav id="navigationComponent">
            <a href="/" className="btn capitalize">
              home
            </a>
            <a href="/shop" className="btn capitalize">
              shop
            </a>
            <a href="/blog" className="btn capitalize">
              about
            </a>
            <a href="/contact" className="btn capitalize">
              contact
            </a>
          </nav>
          <div className="header-nav-actions">
            {user ? (
              <>
                <a href="">
                  <img
                    src={
                      user?.avatar || "./src/assets/images/default-avatar.png"
                    }
                    alt="Avatar"
                    className="btn"
                  />
                </a>
                <p>Xin chào, {user.fullName}</p>
                <button onClick={logout}>Đăng xuất</button>
              </>
            ) : (
              <Link to="/login">Đăng Nhập</Link>
            )}
            <span>
              <img
                src="./src/assets/icons/akar-icons_search.svg"
                className="btn"
              />
            </span>
            <a href="">
              <img
                src="./src/assets/icons/akar-icons_heart.svg"
                className="btn"
              />
            </a>
            <a href="/cart">
              <img
                src="./src/assets/icons/ant-design_shopping-cart-outlined.svg"
                alt="cart"
                className="btn"
              />
            </a>
          </div>
        </div>
        <div id="headerMobileComponent">
          <a
            href="/"
            id="logoComponent"
            className="btn flex w-fit justify-center items-center"
          >
            <img src="./src/assets/images/logo.png" alt="Logo" />
            <span>Furniro</span>
          </a>
          <button className="btn d-md-none" id="menuToggle">
            <img
              src="./src/assets/icons/hamburger-menu.png"
              width={18}
              alt="Menu"
            />
            <nav id="mobileNavigationComponent">
              <div className="mobile-nav-content">
                <a href="/" className="btn capitalize">
                  home
                </a>
                <a href="/shop" className="btn capitalize">
                  shop
                </a>
                <a href="/blog" className="btn capitalize">
                  about
                </a>
                <a href="/contact" className="btn capitalize">
                  contact
                </a>
              </div>
            </nav>
          </button>
          <div className="header-nav-actions">
            <a href="">
              <img
                src="./src/assets/icons/mdi_account-alert-outline.svg"
                className="btn"
              />
            </a>
            <span>
              <img
                src="./src/assets/icons/akar-icons_search.svg"
                className="btn"
              />
            </span>
            <a href="">
              <img
                src="./src/assets/icons/akar-icons_heart.svg"
                className="btn"
              />
            </a>
            <a href="/cart">
              <img
                src="./src/assets/icons/ant-design_shopping-cart-outlined.svg"
                alt="cart"
                className="btn"
              />
            </a>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
