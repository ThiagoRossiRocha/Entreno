import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { SidebarData } from "./SidebarData";
import styled from "styled-components";
import { ImExit } from "react-icons/im";
import ImageCropper from "./imageCropper";

const SidebarMenu = styled.div<{ close: boolean }>`
  width: 20vh;
  height: 91vh;
  background-color: var(--sidebar-color);
  position: relative;
  overflow: hidden;
  left: ${({ close }) => (close ? "0" : "-100%")};
  transition: 0.6s;
  border-radius: 1.5vh;
  margin: 1.5vh 0vh;
  box-shadow: 0 0 0.5vh rgba(0, 0, 0, 0.5);
`;

const MenuItemLinks = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0 2.5vh;
  font-size: 2.5vh;
  text-decoration: none;
  color: black;

  &:hover {
    background: var(--sidebar-color-darken);
    width: 100%;
    height: 4.5vh;
    text-align: center;
    border-radius: 1.5vh;
  }

  &:active {
    box-shadow: 0 0 0.5vh rgba(0, 0, 0, 1);
  }
`;

const Sidebar: React.FunctionComponent = () => {
  const [close, setClose] = useState(false);
  const showSidebar = () => setClose(!close);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        <div className="menuIconOpen" title="Menu" onClick={showSidebar}>
          <FaIcons.FaBars />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageCropper
            headers={{ Authorization: localStorage.getItem("authToken") }}
            buttonDisable={true}
            width={4}
            height={4}
          />
        </div>

        <div>
          <div className="menuIconOpen" title="Sair" onClick={handleLogout}>
            <ImExit />
          </div>
        </div>
      </div>

      <SidebarMenu close={close}>
        <div className="menuIconClose" onClick={showSidebar} />
        {SidebarData.map((item, index) => {
          return (
            <div className="menuItens" key={index}>
              <MenuItemLinks to={item.path}>
                {item.icon}
                <span style={{ marginLeft: "1.2vh" }}>{item.title}</span>
              </MenuItemLinks>
            </div>
          );
        })}
      </SidebarMenu>
    </>
  );
};

export default Sidebar;
