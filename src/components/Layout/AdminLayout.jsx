import React from 'react';
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import FooterAdmin from "../FooterAdmin";
import HeaderAdmin from "../HeaderAdmin";
import SideBarAdmin from "../SideBarAdmin";
import { useBootstrap } from "../../hooks/useBootstrap";

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${(props) => (props.darkMode ? "#1a1a2e" : "#f9f9f9")};
  color: ${(props) => (props.darkMode ? "#e0e0e0" : "inherit")};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 16px 24px;
  overflow-y: auto;
  background-color: transparent;
  height: calc(100vh - 140px);

  @media (max-width: 1024px) {
    padding: 12px 16px;
    height: calc(100vh - 120px);
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    height: auto;
  }
`;

const FooterContainer = styled.div`
  flex-shrink: 0;
  margin-top: auto;

  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Load Bootstrap chỉ cho admin
  useBootstrap();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <LayoutWrapper darkMode={darkMode}>
      <SideBarAdmin
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        darkMode={darkMode}
      />

      <MainContent>
        <HeaderAdmin
          onToggle={handleToggleSidebar}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <Content>
          <Outlet />
        </Content>

        <FooterContainer>
          <FooterAdmin darkMode={darkMode} />
        </FooterContainer>
      </MainContent>
    </LayoutWrapper>
  );
};

export default AdminLayout;
