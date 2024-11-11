import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";

const LabForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const navigate = useNavigate();

  // Função para atualizar os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Função para enviar os dados do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/reservables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Aqui você pode passar o token de autenticação se necessário
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redireciona para a página de laboratórios após o sucesso
        navigate("/labs");
      } else {
        console.error("Erro ao cadastrar laboratório.");
        console.log(localStorage.getItem("jwt"))
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
            Cadastrar Laboratório
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Nome do laboratório */}
            <TextField
              fullWidth
              label="Nome do Laboratório"
              variant="outlined"
              margin="normal"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Localização do laboratório */}
            <TextField
              fullWidth
              label="Localização"
              variant="outlined"
              margin="normal"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            {/* Botão para cadastrar */}
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  backgroundColor: "#1F2732",
                  "&:hover": { backgroundColor: "#3c475a" },
                }}
              >
                Cadastrar
              </Button>
            </Box>
          </form>
        </Container>
      </Container>
    </Box>
  );
};

export default LabForm;
