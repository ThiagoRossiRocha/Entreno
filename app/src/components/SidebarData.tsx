import React from 'react'
import { RiSwordFill } from "react-icons/ri";
import { FaHome, FaUserAlt } from "react-icons/fa";
import confrontationIcon from "../images/icon-confrontation-padel.png";

const viewportHeight = window.innerHeight;

export const SidebarData = [
  {
    title: "Perfil",
    path: "/profile",
    icon: <FaUserAlt />,
  },
  {
    title: "Home",
    path: "/home",
    icon: <FaHome />,
  },
  {
    title: "Matches",
    path: "/matches",
    icon: (
      <img
        src={confrontationIcon}
        alt="Ícone"
        width={`${(2.5 / 100) * viewportHeight}`}
        height={`${(2.9 / 100) * viewportHeight}`}
      />
    ),
  },
  {
    title: "Confrontos",
    path: "/confrontations",
    icon: <RiSwordFill />,
  },
];
