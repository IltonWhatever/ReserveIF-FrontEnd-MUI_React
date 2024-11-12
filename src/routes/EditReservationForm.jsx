import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Menu from "../components/Menu";
import dayjs from "dayjs";

const EditReservationForm = () => {
  const { reservationId } = useParams();
  const [formData, setFormData] = useState({
    observation: "",
    reservableId: "",
    userId: "",
    period: {
      startDay: null,
      endDay: null,
      startHorary: null,
      endHorary: null,
      daysOfWeek: [],
    },
  });
  const [labs, setLabs] = useState([]);
  const [errors, setErrors] = useState({ dateError: "", timeError: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFormData((prevData) => ({
        ...prevData,
        userId: decodedToken.userId,
      }));
    }

    const fetchLabs = async () => {
      const response = await fetch("http://localhost:8080/reservables", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setLabs(await response.json());
      }
    };

    const fetchReservation = async () => {
      const response = await fetch(
        `http://localhost:8080/reserves/${reservationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        
        const data = await response.json();
        console.log(data)
        setFormData({
          ...data,
          period: {
            startDay: dayjs(data.period.startDay),
            endDay: dayjs(data.period.endDay),
            startHorary: dayjs(data.period.startHorary),
            endHorary: dayjs(data.period.endHorary),
            daysOfWeek: data.period.daysOfWeek,
          },
        });
      }
    };

    fetchLabs();
    fetchReservation();
  }, [reservationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.period) {
      setFormData({
        ...formData,
        period: { ...formData.period, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let dateError = "";
    let timeError = "";

    if (formData.period.startDay && formData.period.endDay) {
      if (
        formData.period.startDay.isAfter(formData.period.endDay)
      ) {
        dateError = "A data de início não pode ser maior que a data de fim.";
      }
    }

    if (
      formData.period.startHorary &&
      formData.period.endHorary
    ) {
      if (
        formData.period.startHorary.isAfter(
          formData.period.endHorary
        )
      ) {
        timeError =
          "O horário de início não pode ser maior que o horário de fim.";
      }
    }

    setErrors({ dateError, timeError });
    return !(dateError || timeError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedData = {
      ...formData,
      period: {
        ...formData.period,
        startDay: dayjs(formData.period.startDay).format("DD/MM/YYYY"),
        endDay: dayjs(formData.period.endDay).format("DD/MM/YYYY"),
        startHorary: dayjs(formData.period.startHorary).format("HH:mm"),
        endHorary: dayjs(formData.period.endHorary).format("HH:mm"),
      },
    };

    const response = await fetch(
      `http://localhost:8080/reserves/${reservationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(formattedData),
      }
    );

    if (response.ok) {
      navigate("/DashBoard");
    } else {
      console.error("Erro ao atualizar reserva.");
    }
  };

  const handleDelete = async () => {
    const response = await fetch(
      `http://localhost:8080/reserves/${reservationId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      }
    );
    if (response.ok) {
      navigate("/DashBoard");
    } else {
      console.error("Erro ao apagar reserva.");
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
        <Container sx={{
            margin: "15px",
            backgroundColor: "white",
            borderRadius: "8px",
            display: "block",
            padding: "20px",
          }}>
          <Typography variant="h5">Editar Reserva</Typography>

          {errors.dateError && (
            <Alert severity="error">{errors.dateError}</Alert>
          )}
          {errors.timeError && (
            <Alert severity="error">{errors.timeError}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Observação"
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Laboratório"
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

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data de Início"
                value={formData.period.startDay}
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    period: {
                      ...formData.period,
                      startDay: newValue,
                    },
                  })
                }
                required
              />
              <DatePicker
                label="Data de Fim"
                value={formData.period.endDay}
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    period: {
                      ...formData.period,
                      endDay: newValue,
                    },
                  })
                }
                required
              />
              <TimePicker
                label="Horário de Início"
                value={formData.period.startHorary}
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    period: {
                      ...formData.period,
                      startHorary: newValue,
                    },
                  })
                }
                required
              />
              <TimePicker
                label="Horário de Fim"
                value={formData.period.endHorary}
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    period: {
                      ...formData.period,
                      endHorary: newValue,
                    },
                  })
                }
                required
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
            >
              Atualizar Reserva
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
              sx={{ mt: 2, ml: 2 }}
            >
              Apagar Reserva
            </Button>
          </form>
        </Container>
      </Container>
    </Box>
  );
};

export default EditReservationForm;