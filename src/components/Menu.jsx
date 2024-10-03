import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssessmentIcon from '@mui/icons-material/Assessment';
import logo from '../assets/logoBranca.png'; 
import { useNavigate } from 'react-router-dom';
import '../css/menu.css';

function VerticalMenu() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path); // Navega para o caminho fornecido
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        minWidth:'12vw',
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          minWidth:'12vw',
          boxSizing: 'border-box',
          backgroundColor: '#1F2732',
        },
      }}
    >
      {/* Logo na parte superior */}
      <Box className="drawer-box">
        <img src={logo} alt="Logo" style={{ width: '200px' }} />
      </Box>
      <Box className="drawer-box">Menu</Box>

      {/* Lista de opções */}
      <List>
        <ListItemButton className="drawer-item" onClick={() => handleNavigation('/Login')}>
          <ListItemIcon>
            <LaptopMacIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText className="drawer-item-text" primary="Laboratórios" />
        </ListItemButton>

        <ListItemButton className="drawer-item" onClick={() => handleNavigation('/Reservas')}>
          <ListItemIcon>
            <EventAvailableIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText className="drawer-item-text" primary="Reservas" />
        </ListItemButton>

        <ListItemButton className="drawer-item" onClick={() => handleNavigation('/Relatorios')}>
          <ListItemIcon>
            <AssessmentIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText className="drawer-item-text" primary="Relatórios" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export default VerticalMenu;
