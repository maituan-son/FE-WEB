import styled from "@emotion/styled";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const SidebarWrapper = styled.aside`
  width: ${(props) => (props.collapsed ? "80px" : "250px")};
  transition: width 0.3s ease;
  background-color: rgb(127, 203, 214);
  color: white;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 20px;
  align-self: ${(props) => (props.collapsed ? "center" : "flex-end")};
  transition: transform 0.3s ease;

  &:focus {
    outline: none;
  }
`;

const MenuItem = styled.div`
  margin: 16px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${(props) => (props.collapsed ? "0" : "16px")};
  opacity: ${(props) => (props.collapsed ? "0" : "1")};
  transition: opacity 0.2s ease, font-size 0.2s ease;
`;

const StyledNavLink = styled(NavLink)`
  color: inherit;
  text-decoration: none;

  &.active {
    font-weight: bold;
    text-decoration: underline;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const menuItems = [
  { to: "", label: "Dashboard" },
  { to: "users", label: "Users" },
  { to: "products", label: "Products" },
  { to: "categories", label: "Categories" },
  { to: "settings", label: "Settings" },
];

const SideBarAdmin = ({ collapsed, onToggle }) => {
  return (
    <SidebarWrapper collapsed={collapsed}>
      <ToggleButton
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        collapsed={collapsed}
        onClick={onToggle}
      >
        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </ToggleButton>
      {menuItems.map(({ to, label }) => (
        <MenuItem key={label} collapsed={collapsed}>
          <StyledNavLink to={to} end>
            {label}
          </StyledNavLink>
        </MenuItem>
      ))}
    </SidebarWrapper>
  );
};

export default SideBarAdmin;
