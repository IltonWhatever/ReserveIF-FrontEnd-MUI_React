import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, Container } from "@mui/material";
import { jwtDecode } from "jwt-decode";

function DashBoard() {
  const decoded = jwtDecode(localStorage.getItem("jwt"));
  const [username, setUsername] = useState(decoded.userFullName);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserReservations = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await fetch(
          `http://localhost:8080/reserves/by-user?userID=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar reservas do usuário.");
        }

        const data = await response.json();
        console.log(data);
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReservations();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleReservationClick = (reservationId) => {
    navigate(`/edit-reservation/${reservationId}`);
  };

    useEffect(() => {
      console.log('Reserva', reservations);
    }, [reservations]);
    

  return (
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

        <Container sx={{ backgroundColor: "white", borderRadius: "20px" }}>
          {reservations.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", margin: "20px" }}
            >
              Nenhuma reserva encontrada para hoje.
            </Typography>
          ) : (
            <Slider {...settings}>
              {reservations.map((reservation) => (
                <Box
                  key={reservation.id} // Usando 'reservation.id' para garantir a unicidade da chave
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFFFFF",
                    minHeight: "20vh",
                    minWidth: "15vw",
                    borderRadius: "10px",
                    fontFamily: "Poppins",
                    color: "#1f2732",
                    padding: "10px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleReservationClick(reservation.id)}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: "8px" }}
                  >
                    Laboratório: {reservation.reservable}
                  </Typography>
                  <Typography variant="body2">
                    Status: {reservation.status}
                  </Typography>
                  <Typography variant="body2">
                    Observação: {reservation.observation}
                  </Typography>
                  <Typography variant="body2">
                    Período: {reservation.period.startDay} até{" "}
                    {reservation.period.endDay}
                  </Typography>
                  <Typography variant="body2">
                    Horário: {reservation.period.startHorary} -{" "}
                    {reservation.period.endHorary}
                  </Typography>
                </Box>
              ))}
            </Slider>
          )}
        </Container>
      </Container>
    </Box>
  );
}

export default DashBoard;
