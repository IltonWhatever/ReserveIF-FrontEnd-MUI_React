import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/logoBranca.png";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useNavigate } from "react-router-dom";
import "../css/menu.css";
import { jwtDecode  } from 'jwt-decode';


function VerticalMenu() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path); // Navega para o caminho fornecido
  };

  const token = localStorage.getItem("jwt"); // Supondo que o token esteja no localStorage
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.groups.includes("Administrador");
  }

  const handleLogout = () => {
    // Remove o JWT do localStorage
    localStorage.removeItem("jwt");

    navigate("/login");

    // Forçar recarregamento da página
    window.location.reload(); // Isso recarrega a página inteira
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        minWidth: "12vw",
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          minWidth: "12vw",
          boxSizing: "border-box",
          backgroundColor: "#1F2732",
        },
      }}
    >
      {/* Logo na parte superior */}
      <Box className="drawer-box">
        <img src={logo} alt="Logo" style={{ width: "200px" }} />
      </Box>
      <Box className="drawer-box">Menu</Box>

      {/* Lista de opções */}
      <List>
       <ListItemButton
          className="drawer-item"
          onClick={() => handleNavigation("/Labs")}
        >
          <ListItemIcon>
            <LaptopMacIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText className="drawer-item-text" primary="Laboratórios" />
        </ListItemButton>

        {isAdmin && (<ListItemButton
          className="drawer-item"
          onClick={() => handleNavigation("/LabForm")}
        >
          <ListItemIcon>
            <AppRegistrationIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText
            className="drawer-item-text"
            primary="Registrar Laboratorio"
          />
        </ListItemButton>)}

        <ListItemButton
          className="drawer-item"
          onClick={() => handleNavigation("/DashBoard")}
        >
          <ListItemIcon>
            <EventAvailableIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText className="drawer-item-text" primary="Reservas" />
        </ListItemButton>
        <ListItemButton
          className="drawer-item"
          onClick={() => handleNavigation("/ReservationForm")}
        >
          <ListItemIcon>
            <NewspaperIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText className="drawer-item-text" primary="Nova Reserva" />
        </ListItemButton>

        {isAdmin && (<ListItemButton
          className="drawer-item"
          onClick={() => handleNavigation("/PendingReservations")}
        >
          <ListItemIcon>
            <PendingActionsIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText className="drawer-item-text" primary="Reservas Pendentes" />
        </ListItemButton>)}

        {isAdmin &&(
        <ListItemButton
          className="drawer-item"
          onClick={() => handleNavigation("/Reports")}
        >
          <ListItemIcon>
            <AssessmentIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText className="drawer-item-text" primary="Relatórios" />
        </ListItemButton>)}

        <ListItemButton className="drawer-item" onClick={() => handleLogout()}>
          <ListItemIcon>
            <LogoutIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText className="drawer-item-text" primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export default VerticalMenu;
