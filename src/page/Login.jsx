import React, { useState } from "react";
import "../assets/css/login.css";
import { login, register } from "../api/login";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../components/authStore/authStore";

const Login = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const navigate = useNavigate();

  const setUserData = useAuthStore((state) => state.login); // ✅ lấy login function từ store

  const handleSignUpClick = () => setRightPanelActive(true);
  const handleSignInClick = () => setRightPanelActive(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login({ email: loginEmail, password: loginPassword });
      const { token, user } = res.data || {};
      
      setUserData({ user, token }); // ✅ lưu vào Zustand
      toast.success("Đăng nhập thành công!");
      setLoginEmail("");
      setLoginPassword("");

      navigate("/"); // ✅ hoặc redirect phù hợp
    } catch (error) {
      toast.error(
        "Đăng nhập thất bại: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({
        fullName: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setRightPanelActive(false);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (error) {
      toast.error(
        "Đăng ký thất bại: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div
        className={`container${rightPanelActive ? " right-panel-active" : ""}`}
        id="container"
      >
        {/* Register */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Tạo tài khoản</h1>
            <p>Đăng ký để sử dụng dịch vụ của chúng tôi</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="Họ và tên"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input-group password-group">
              <input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                disabled={isLoading}
              >
                {showRegisterPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <button type="submit" disabled={isLoading} className={isLoading ? "loading" : ""}>
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>
        </div>

        {/* Login */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Đăng nhập</h1>
            <p>Sử dụng tài khoản của bạn để đăng nhập</p>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <a href="#">Quên mật khẩu?</a>
            <button type="submit" disabled={isLoading} className={isLoading ? "loading" : ""}>
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Chào mừng trở lại!</h1>
              <p>
                Để tiếp tục kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn
              </p>
              <button className="ghost" onClick={handleSignInClick} disabled={isLoading}>
                Đăng nhập
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Xin chào!</h1>
              <p>Nhập thông tin cá nhân của bạn và bắt đầu hành trình cùng chúng tôi</p>
              <button className="ghost" onClick={handleSignUpClick} disabled={isLoading}>
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
