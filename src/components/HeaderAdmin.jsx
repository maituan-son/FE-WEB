import React, { useState } from "react";
import styled from "@emotion/styled";
import useAuthStore from "./authStore/authStore";
import {
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";

const HeaderWrapper = styled.header`
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)"};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid
    ${(props) =>
      props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px
    ${(props) => (props.darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)")};
  transition: all 0.3s ease;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.darkMode ? "#fff" : "#374151")};
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
    transform: scale(1.05);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid
    ${(props) =>
      props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  border-radius: 12px;
  background: ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.8)"};
  color: ${(props) => (props.darkMode ? "#fff" : "#374151")};
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: ${(props) =>
      props.darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"};
  }

  &:focus {
    border-color: ${(props) => (props.darkMode ? "#667eea" : "#3b82f6")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.darkMode
          ? "rgba(102, 126, 234, 0.3)"
          : "rgba(59, 130, 246, 0.3)"};
    background: ${(props) =>
      props.darkMode ? "rgba(255, 255, 255, 0.1)" : "#ffffff"};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"};
  font-size: 18px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.darkMode ? "#fff" : "#374151")};
  font-size: 20px;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${(props) =>
        props.darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const UserButton = styled.button`
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
      : "linear-gradient(135deg, #ffffff, #f8fafc)"};
  border: 1px solid
    ${(props) =>
      props.darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"};
  padding: 8px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${(props) => (props.darkMode ? "#fff" : "#374151")};
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px
      ${(props) =>
        props.darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"};
    background: ${(props) =>
      props.darkMode
        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))"
        : "linear-gradient(135deg, #f8fafc, #e2e8f0)"};
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.darkMode ? "#fff" : "#374151")};
`;

const UserRole = styled.span`
  font-size: 12px;
  color: ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)"};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(135deg, #1a1a2e, #16213e)"
      : "linear-gradient(135deg, #ffffff, #f8fafc)"};
  border: 1px solid
    ${(props) =>
      props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  border-radius: 12px;
  box-shadow: 0 20px 40px
    ${(props) =>
      props.darkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.15)"};
  backdrop-filter: blur(20px);
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${(props) => (props.darkMode ? "#fff" : "#374151")};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
  }
`;

const HeaderAdmin = ({ onToggleSidebar, darkMode, toggleDarkMode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    // Redirect to login page or perform any other logout actions
    window.location.href = "/"; // Adjust the redirect path as needed
  };

  return (
    <HeaderWrapper darkMode={darkMode}>
      <LeftSection>
        <MenuButton darkMode={darkMode} onClick={onToggleSidebar}>
          <FiMenu />
        </MenuButton>

        <SearchContainer>
          <SearchIcon darkMode={darkMode}>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            darkMode={darkMode}
          />
        </SearchContainer>
      </LeftSection>

      <RightSection>
        <IconButton darkMode={darkMode} onClick={toggleDarkMode}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </IconButton>

        <IconButton darkMode={darkMode}>
          <FiBell />
          <NotificationBadge>3</NotificationBadge>
        </IconButton>

        <UserSection>
          <UserButton
            darkMode={darkMode}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <UserAvatar>MS</UserAvatar>
            <UserInfo>
              {user ? (
                <>
                  <UserName darkMode={darkMode}>{user.fullName}</UserName>
                  <UserRole darkMode={darkMode}>{user.role}</UserRole>
                </>
              ) : (
                <>Khách</>
              )}
            </UserInfo>
            <FiChevronDown />
          </UserButton>

          <DropdownMenu darkMode={darkMode} isOpen={isDropdownOpen}>
            <DropdownItem darkMode={darkMode}>
              <FiUser />
              Hồ sơ cá nhân
            </DropdownItem>
            <DropdownItem darkMode={darkMode}>
              <FiSettings />
              Cài đặt
            </DropdownItem>
            <DropdownItem darkMode={darkMode} onClick={handleLogout}>
              <FiLogOut />
              Đăng xuất
            </DropdownItem>
          </DropdownMenu>
        </UserSection>
      </RightSection>
    </HeaderWrapper>
  );
};

export default HeaderAdmin;
