import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import Menu from "../components/Menu";

function Reports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryType, setQueryType] = useState(""); // Para selecionar o tipo de consulta
  const [queryValue, setQueryValue] = useState(""); // Para armazenar o valor da consulta
  const [statusReserve, setStatusReserve] = useState(""); // Para armazenar o status de aprovação
  const [laboratories, setLaboratories] = useState([]); // Para armazenar os laboratórios
  const [selectedLaboratory, setSelectedLaboratory] = useState(""); // Para armazenar o laboratório selecionado

  const decoded = jwtDecode(localStorage.getItem("jwt"));
  const userId = decoded.userId;

  useEffect(() => {
    const token = localStorage.getItem("jwt"); // Recupera o token armazenado

    if (!token) {
      setError("Token não encontrado");
      setLoading(false);
      return;
    }
    // Carregar os laboratórios quando o componente for montado
    const fetchLaboratories = async () => {
      try {
        const response = await fetch("http://localhost:8080/reservables", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar laboratórios.");
        }
        const data = await response.json();
        setLaboratories(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLaboratories();
  }, []);

  const handleQueryChange = (e) => {
    setQueryType(e.target.value);
    setQueryValue(""); // Limpa o valor ao alterar o tipo de consulta
    setSelectedLaboratory(""); // Limpa a seleção de laboratório
  };

  const handleInputChange = (e) => {
    setQueryValue(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusReserve(e.target.value);
  };

  const handleLaboratoryChange = (e) => {
    setSelectedLaboratory(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = "";
      switch (queryType) {
        case "all":
          url = "http://localhost:8080/reserves"; // Sem necessidade de valor adicional
          break;
        case "byStatus":
          url = `http://localhost:8080/reserves/by-status?statusReserve=${statusReserve}`;
          break;
        case "byUser":
          url = `http://localhost:8080/reserves/by-user?userID=${
            queryValue || userId
          }`; // Usuário logado se não for fornecido um ID
          break;
        case "byReservable":
          url = `http://localhost:8080/reserves/by-reservable?reservableID=${selectedLaboratory}`;
          break;
        case "byHoraryInterval":
          const [beginning, end] = queryValue.split("-");
          url = `http://localhost:8080/reserves/by-horary-interval?beginning=${beginning}&end=${end}`;
          break;
        case "byDateInterval":
          const [startDate, finishDate] = queryValue.split("-");
          url = `http://localhost:8080/reserves/by-date-interval?beginning=${startDate}&end=${finishDate}`;
          break;
        case "byId":
          url = `http://localhost:8080/reserves/${queryValue}`;
          break;
        default:
          throw new Error("Selecione um tipo de consulta");
      }

      const token = localStorage.getItem("jwt");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar relatórios.");
      }

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        <Container
          sx={{
            margin: "15px",
            backgroundColor: "white",
            borderRadius: "8px",
            display: "block",
            padding: "20px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Relatórios de Reservas
          </Typography>

          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel>Selecione o tipo de consulta</InputLabel>
            <Select value={queryType} onChange={handleQueryChange}>
              <MenuItem value="all">Consultar todas reservas</MenuItem>
              <MenuItem value="byStatus">Consultar por aprovação</MenuItem>
              <MenuItem value="byUser">Consultar reservas por usuário</MenuItem>
              <MenuItem value="byReservable">
                Consultar por laboratório
              </MenuItem>
              <MenuItem value="byHoraryInterval">
                Consultar por horário de intervalo
              </MenuItem>
              <MenuItem value="byDateInterval">
                Consultar por intervalo de data
              </MenuItem>
              <MenuItem value="byId">Consultar por Id</MenuItem>
            </Select>
          </FormControl>

          {queryType === "byStatus" && (
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel>Selecione o status</InputLabel>
              <Select value={statusReserve} onChange={handleStatusChange}>
                <MenuItem value="Pendente">Pendente</MenuItem>
                <MenuItem value="Aprovado">Aprovado</MenuItem>
                <MenuItem value="Desaprovado">Desaprovado</MenuItem>
              </Select>
            </FormControl>
          )}

          {queryType === "byReservable" && (
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel>Selecione o laboratório</InputLabel>
              <Select
                value={selectedLaboratory}
                onChange={handleLaboratoryChange}
                disabled={laboratories.length === 0}
              >
                {laboratories.map((lab) => (
                  <MenuItem key={lab.id} value={lab.id}>
                    {lab.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {queryType !== "all" &&
            queryType !== "byStatus" &&
            queryType !== "byReservable" && (
              <TextField
                label="Digite o valor"
                value={queryValue}
                onChange={handleInputChange}
                fullWidth
                sx={{ marginBottom: "20px" }}
                placeholder={
                  queryType === "byHoraryInterval"
                    ? "Ex: 10:00-23:59"
                    : queryType === "byDateInterval"
                    ? "Ex: 01/13/2024-29/01/2024"
                    : "Digite o valor"
                }
              />
            )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={
              loading ||
              !queryType ||
              (queryType !== "all" &&
                queryType !== "byStatus" &&
                queryType !== "byReservable" &&
                !queryValue) ||
              (queryType === "byStatus" && !statusReserve) ||
              (queryType === "byReservable" && !selectedLaboratory)
            }
            sx={{ marginBottom: "20px" }}
          >
            {loading ? "Carregando..." : "Consultar"}
          </Button>

          {error && <Typography color="error">{error}</Typography>}

          {reportData.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {reportData.map((reservation, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Laboratório: {reservation.reservable}
                  </Typography>
                  <Typography>Status: {reservation.status}</Typography>
                  <Typography>Observação: {reservation.observation}</Typography>
                  <Typography>
                    Período: {reservation.period.startDay} até{" "}
                    {reservation.period.endDay}
                  </Typography>
                  <Typography>
                    Horário: {reservation.period.startHorary} -{" "}
                    {reservation.period.endHorary}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Container>
    </Box>
  );
}

export default Reports;
