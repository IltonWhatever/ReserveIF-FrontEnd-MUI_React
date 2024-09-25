import React from 'react';
import { Drawer, List, ListItem, ListItemButton , ListItemIcon, ListItemText, Box } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import logo from '../assets/logoBranca.png'; // Importe a logo
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';


import '../css/menu.css';

function VerticalMenu() {
  
  const navigate = useNavigate(); // Hook para navegação
  // Funções de navegação
  const goToLogin = () => navigate('/Login');

  return (
    <Drawer
      variant="permanent" // Mantém o menu fixo
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1F2732', // Cor de fundo cinza
        },
      }}
    >
      {/* Logo na parte superior */}
      <Box className='drawer-box'>
        <img src={logo} alt="Logo" style={{ width: '200px' }} />
      </Box>
      <Box className='drawer-box'>
        Menu
      </Box>

      {/* Lista de opções */}
      <List>
        <ListItemButton className='drawer-item' onClick={goToLogin}>
          <ListItemIcon>
            <LaptopMacIcon className='drawer-icon'/>
          </ListItemIcon>
          <ListItemText className='drawer-item-text' primary="Laboratórios" />
        </ListItemButton>

        <ListItemButton className='drawer-item'>
          <ListItemIcon>
            <EventAvailableIcon className='drawer-icon'/>
          </ListItemIcon>
          <ListItemText className='drawer-item-text' primary="Reservas" />
        </ListItemButton>

        <ListItemButton className='drawer-item'>
          <ListItemIcon>
            <AssessmentIcon className='drawer-icon'/>
          </ListItemIcon>
          <ListItemText className='drawer-item-text' primary="Relatórios" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export default VerticalMenu;
