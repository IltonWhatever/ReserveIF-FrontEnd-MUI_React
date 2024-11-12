import React, { useState, useEffect } from "react";
import { Box, Container, Typography, TextField, Button, Select, MenuItem, Chip, FormControl, InputLabel, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { jwtDecode  } from 'jwt-decode';
import dayjs from "dayjs"; // Importa dayjs para formatação

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    observation: "",
    reservableId: "",
    userId: "", // O userId será obtido do JWT
    periodReserve: {
      startDay: null,
      endDay: null,
      startHorary: null,
      endHorary: null,
      daysOfWeek: [],
    },
  });
  const [labs, setLabs] = useState([]);
  const [errors, setErrors] = useState({
    dateError: "",
    timeError: "",
  });
  const navigate = useNavigate();

  // UseEffect para decodificar o JWT e pegar o userId
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFormData((prevData) => ({
        ...prevData,
        userId: decodedToken.userId, // Supondo que o JWT tenha o campo 'userId'
      }));
    }

    const fetchLabs = async () => {
      try {
        const response = await fetch("http://localhost:8080/reservables", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLabs(data);
        } else {
          console.error("Erro ao buscar laboratórios.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchLabs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.periodReserve) {
      setFormData({
        ...formData,
        periodReserve: {
          ...formData.periodReserve,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDaysOfWeekChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      periodReserve: {
        ...formData.periodReserve,
        daysOfWeek: typeof value === "string" ? value.split(",") : value,
      },
    });
  };

  // Função de validação
  const validateForm = () => {
    let dateError = "";
    let timeError = "";

    // Verificar se a data de início é maior que a data de fim
    if (formData.periodReserve.startDay && formData.periodReserve.endDay) {
      if (formData.periodReserve.startDay.isAfter(formData.periodReserve.endDay)) {
        dateError = "A data de início não pode ser maior que a data de fim.";
      }
    }

    // Verificar se o horário de início é maior que o horário de fim
    if (formData.periodReserve.startHorary && formData.periodReserve.endHorary) {
      if (formData.periodReserve.startHorary.isAfter(formData.periodReserve.endHorary)) {
        timeError = "O horário de início não pode ser maior que o horário de fim.";
      }
    }

    if (dateError || timeError) {
      setErrors({ dateError, timeError });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar antes de submeter
    if (!validateForm()) return;

    // Formatar as datas e horários antes de enviar para o servidor
    const formattedData = {
      ...formData,
      periodReserve: {
        ...formData.periodReserve,
        startDay: dayjs(formData.periodReserve.startDay).format("DD/MM/YYYY"),
        endDay: dayjs(formData.periodReserve.endDay).format("DD/MM/YYYY"),
        startHorary: dayjs(formData.periodReserve.startHorary).format("HH:mm"),
        endHorary: dayjs(formData.periodReserve.endHorary).format("HH:mm"),
      },
    };

    try {
      const response = await fetch("http://localhost:8080/reserves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        navigate("/DashBoard");
      } else {
        console.error("Erro ao cadastrar reserva.");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
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
            sx={{ marginBottom: "16px", fontWeight: "bold", textAlign: "center" }}
          >
            Cadastrar Reserva
          </Typography>

          {errors.dateError && <Alert severity="error">{errors.dateError}</Alert>}
          {errors.timeError && <Alert severity="error">{errors.timeError}</Alert>}

          <form onSubmit={handleSubmit}>
            {/* Observação */}
            <TextField
              fullWidth
              label="Observação"
              variant="outlined"
              margin="normal"
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              required
            />

            {/* ID do Reservável (Laboratórios do sistema) */}
            <TextField
              fullWidth
              label="Laboratório"
              variant="outlined"
              margin="normal"
              name="reservableId"
              select
              value={formData.reservableId}
              onChange={handleChange}
              required
            >
              {labs.map((lab) => (
                <MenuItem key={lab.id} value={lab.id}>
                  {`ID: ${lab.id} - ${lab.name}`}
                </MenuItem>
              ))}
            </TextField>

            {/* ID do Usuário (obtido do JWT) */}
            <TextField
              fullWidth
              label="ID do Usuário"
              variant="outlined"
              margin="normal"
              name="userId"
              value={formData.userId} // O ID do usuário vem do JWT
              disabled
            />

            {/* Datas */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data de Início"
                value={formData.periodReserve.startDay}
                onChange={(newValue) => {
                  setFormData({
                    ...formData,
                    periodReserve: {
                      ...formData.periodReserve,
                      startDay: newValue,
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    name="startDay"
                    required
                  />
                )}
              />

              <DatePicker
                label="Data de Fim"
                value={formData.periodReserve.endDay}
                onChange={(newValue) => {
                  setFormData({
                    ...formData,
                    periodReserve: {
                      ...formData.periodReserve,
                      endDay: newValue,
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    name="endDay"
                    required
                  />
                )}
              />

              <TimePicker
                label="Horário de Início"
                value={formData.periodReserve.startHorary}
                onChange={(newValue) => {
                  setFormData({
                    ...formData,
                    periodReserve: {
                      ...formData.periodReserve,
                      startHorary: newValue,
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    name="startHorary"
                    required
                  />
                )}
              />

              <TimePicker
                label="Horário de Fim"
                value={formData.periodReserve.endHorary}
                onChange={(newValue) => {
                  setFormData({
                    ...formData,
                    periodReserve: {
                      ...formData.periodReserve,
                      endHorary: newValue,
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    name="endHorary"
                    required
                  />
                )}
              />
            </LocalizationProvider>

            {/* Botão para enviar o formulário */}
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
              <Button variant="contained" color="primary" type="submit">
                Cadastrar Reserva
              </Button>
            </Box>
          </form>
        </Container>
      </Container>
    </Box>
  );
};

export default ReservationForm;
