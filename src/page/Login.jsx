import React, { useState } from "react";
import "../assets/scss/pages/_login.scss";
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
  const navigate = useNavigate();

  const setUserData = useAuthStore((state) => state.login); // ✅ lấy login function từ store

  const handleSignUpClick = () => setRightPanelActive(true);
  const handleSignInClick = () => setRightPanelActive(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email: loginEmail, password: loginPassword });
      const { token, user } = res.data || {};
      // console.log(res.data);

      // if (!user?.isVerifyEmail !== true) {
      //   toast.error("Vui lòng xác thực email trước khi đăng nhập");
      //   return;
      // }
      // console.log(user, token);

      setUserData({ user, token }); // ✅ lưu vào Zustand
      toast.success("Login successful!");
      setLoginEmail("");
      setLoginPassword("");

      navigate("/"); // ✅ hoặc redirect phù hợp
    } catch (error) {
      toast.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
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
        "Registration failed: " +
          (error.response?.data?.message || error.message)
      );
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
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Full Name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Login */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign in</h1>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
