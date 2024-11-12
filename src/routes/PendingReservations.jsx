import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import Menu from "../components/Menu";

function PendingReservations() {
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingReservations = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }

        // Aqui o admin tem que buscar todas as reservas pendentes
        const response = await fetch(
          "http://localhost:8080/reserves/by-status?statusReserve=Pendente",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar reservas pendentes.");
        }

        const data = await response.json();
        console.log(data);
        setPendingReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReservations();
  }, []);

  const handleApprove = async (reservationId) => {
    const token = localStorage.getItem("jwt");

    try {
      // Enviar PATCH para atualizar o status da reserva
      const response = await fetch(
        `http://localhost:8080/reserves/${reservationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approved: "true" }), // Alterando o status para "aprovado"
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao aprovar a reserva.");
      }

      // Atualizar o estado para remover a reserva da lista de pendentes
      setPendingReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

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
        <Container  sx={{
            margin: "15px",
            backgroundColor: "white",
            borderRadius: "8px",
            display: "block",
            padding: "20px",
          }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Reservas Pendentes
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ marginBottom: "20px", textAlign: "center" }}
          >
            Clique em uma reserva para aprová-la
          </Typography>

          {loading && <Typography>Carregando...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          <Box>
            {pendingReservations.length === 0 ? (
              <Typography
                variant="h6"
                sx={{ textAlign: "center", margin: "20px" }}
              >
                Não há reservas pendentes.
              </Typography>
            ) : (
              pendingReservations.map((reservation) => (
                <Box
                  key={reservation.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFFFFF",
                    minHeight: "20vh",
                    margin: "10px 0",
                    padding: "15px",
                    borderRadius: "10px",
                    fontFamily: "Poppins",
                    color: "#1f2732",
                    textAlign: "center",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
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

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApprove(reservation.id)}
                    sx={{ marginTop: "10px" }}
                  >
                    Aprovar Reserva
                  </Button>
                </Box>
              ))
            )}
          </Box>
        </Container>
      </Container>
    </Box>
  );
}

export default PendingReservations;
