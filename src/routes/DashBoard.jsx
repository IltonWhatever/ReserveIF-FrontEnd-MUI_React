import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, Button, Container } from "@mui/material";
import "../css/dashBoard.css";
import { jwtDecode } from 'jwt-decode';

function DashBoard() {
  // Variaveis core.
  const decoded = jwtDecode(localStorage.getItem("jwt"));
  const [username, setUsername] = useState(decoded.userFullName);
  const [reservations, setReservations] = useState([]);

  const navigate = useNavigate();

  // Configurações do slider
  const settings = {
    dots: true, // Exibe indicadores abaixo do carrossel
    infinite: true, // Loop infinito
    speed: 500, // Velocidade de transição
    slidesToShow: 3, // Quantidade de slides visíveis
    slidesToScroll: 1, // Quantidade de slides ao rolar
    arrows: true, // Exibe setas de navegação
    responsive: [
      {
        breakpoint: 1024, // Para telas menores que 1024px
        settings: {
          slidesToShow: 2, // Mostra 2 slides
        },
      },
      {
        breakpoint: 600, // Para telas menores que 600px
        settings: {
          slidesToShow: 1, // Mostra 1 slide
        },
      },
    ],
  };

  return (
    // TELA
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "80vw",
        flexDirection: "row",
      }}
    >
      <Container>
        <Menu />
      </Container>

      <Container
        sx={{
          margin: "25px",
          display: "block",
          backgroundColor: "#2F9E41",
          flexGrow: 1,
          borderRadius: "8px",
          minWidth: "80vw",
        }}
      >
        {/* Saudação do usuário */}
        <Typography
          variant="h5"
          sx={{
            marginTop: "10px",
            color: "#FFFFFF",
            fontFamily: "Poppins",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Olá, {username}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            marginBottom: "20px",
            color: "#FFFFFF",
            fontFamily: "Poppins",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Veja suas reservas do dia
        </Typography>

        {/* Carrossel de Laboratórios Reservados */}
        <Container sx={{ backgroundColor: "white", borderRadius: "20px" }}>
          {/* Verificação se há reservas */}
          {reservations.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: "center", margin: "20px" }}>
              Nenhuma reserva encontrada para hoje.
            </Typography>
          ) : (
            <Slider {...settings}>
              {reservations.map((reservation, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    backgroundColor: "#FFFFFF",
                    minHeight: "15vh",
                    minWidth: "10vw",
                    borderRadius: "10px",
                    fontFamily: "Poppins",
                    color: "#1f2732",
                    textAlign: "center", // Centraliza o texto dentro do Box    
                  }}
                >
                  <Typography variant="h6" sx={{ marginTop: "20px" }}>
                    {reservation.lab}
                  </Typography>
                  <Typography variant="body1">{reservation.time}</Typography>
                </Box>
              ))}
            </Slider>
          )}
        </Container>

        {/* Reserve um laboratório */}
        <Box
          sx={{
            marginTop: "32px",
            padding: "16px",
            backgroundColor: "#4CAF50",
            borderRadius: "8px",
            color: "#fff",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Reserve um laboratório
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {["Laboratório 1", "Laboratório 2", "Laboratório 3"].map((lab, index) => (
              <Button
                key={index}
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: "#1F2732",
                  "&:hover": { backgroundColor: "#3c475a" },
                }}
              >
                {lab}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Últimas Reservas */}
        <Box sx={{ marginTop: "32px" }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#4CAF50" }}>
            Últimas reservas
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {["Lab 1", "Lab 2", "Lab 3"].map((lab, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "#fff",
                  padding: "16px",
                  borderRadius: "8px",
                  minWidth: "150px",
                  textAlign: "center",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ color: "#1F2732" }}>
                  {lab}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default DashBoard;
