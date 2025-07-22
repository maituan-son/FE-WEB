import styled from "@emotion/styled";
import {
  FiMenu,
  FiHome,
  FiBox,
  FiUsers,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const SidebarWrapper = styled.aside`
  width: ${(props) => (props.collapsed ? "80px" : "280px")};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  height: 100vh;
  padding: 24px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0 20px 20px 0;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 1000;
    height: 100vh;
    left: ${(props) => (props.collapsed ? "-280px" : "0")};
    width: 280px;
    transition: left 0.3s ease;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  padding: 12px;
  position: relative;
  z-index: 1;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: white;
  display: ${(props) => (props.$collapsed ? "none" : "block")};
  transition: opacity 0.3s ease;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: -15px;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 10;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
  }
`;

const NavList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
`;

const NavSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding-left: 16px;
  display: ${(props) => (props.$collapsed ? "none" : "block")};
`;

const StyledNavLink = styled(NavLink)`
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  width: 100%;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  position: relative;
  overflow: hidden;
  margin-bottom: 4px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent);
    transition: width 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    transform: translateX(4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    &::before {
      width: 100%;
    }
  }

  &.active {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.1)
    );
    color: #fff;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, #ff6b6b, #feca57);
      border-radius: 0 4px 4px 0;
    }

    svg {
      color: #fff;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }
  }

  svg {
    font-size: 22px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
`;

const LabelText = styled.span`
  display: ${(props) => (props.$collapsed ? "none" : "inline")};
  transition: opacity 0.3s ease;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  margin: 16px 0;
  display: ${(props) => (props.$collapsed ? "none" : "block")};
`;

const mainMenuItems = [
  { to: "", label: "Dashboard", icon: <FiHome /> },
  { to: "products", label: "Sản phẩm", icon: <FiBox /> },
  { to: "users", label: "Người dùng", icon: <FiUsers /> },
  { to: "orders", label: "Đơn hàng", icon: <FiShoppingCart /> },
  { to: "categories", label: "Danh mục", icon: <FiBox /> },
  { to: "subcategories", label: "Danh mục con", icon: <FiBox /> },
  { to: "attribute", label: "Thuộc tính", icon: <FiBox /> },
  { to: "attribute-values", label: "Giá trị thuộc tính", icon: <FiBox /> },
  { to: "brands", label: "Thương hiệu", icon: <FiBox /> },
  { to: "blogs", label: "Bài viết", icon: <FiBox /> },
  { to: "comments", label: "Bình luận", icon: <FiBox /> },
];

const systemMenuItems = [
  { to: "reports", label: "Báo cáo", icon: <FiBarChart2 /> },
  { to: "settings", label: "Cài đặt", icon: <FiSettings /> },
];

const SideBarAdmin = ({ collapsed, onToggle }) => {
  return (
    <SidebarWrapper collapsed={collapsed}>
      <ToggleButton onClick={onToggle}>
        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </ToggleButton>

      <LogoSection>
        <LogoIcon>A</LogoIcon>
        <LogoText $collapsed={collapsed}>Admin Panel</LogoText>
      </LogoSection>

      <NavList>
        <NavSection>
          <SectionTitle $collapsed={collapsed}>Chính</SectionTitle>
          {mainMenuItems.map(({ to, label, icon }) => (
            <StyledNavLink key={label} to={to} end $collapsed={collapsed}>
              {icon}
              <LabelText $collapsed={collapsed}>{label}</LabelText>
            </StyledNavLink>
          ))}
        </NavSection>

        <Divider $collapsed={collapsed} />

        <NavSection>
          <SectionTitle $collapsed={collapsed}>Hệ thống</SectionTitle>
          {systemMenuItems.map(({ to, label, icon }) => (
            <StyledNavLink key={label} to={to} end $collapsed={collapsed}>
              {icon}
              <LabelText $collapsed={collapsed}>{label}</LabelText>
            </StyledNavLink>
          ))}
        </NavSection>
      </NavList>
    </SidebarWrapper>
  );
};

export default SideBarAdmin;
