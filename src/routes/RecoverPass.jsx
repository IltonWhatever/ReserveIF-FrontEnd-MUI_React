import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import logo from "../assets/logo.png"; // Substitua pelo caminho correto da sua logo

function RecoverPass() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendRequest = (e) => {
    e.preventDefault();
    
    // Validação simples de e-mail
    if (!email) {
      setError("Por favor, insira o seu e-mail.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    // Enviar solicitação de recuperação de senha (exemplo)
    setError("");
    setMessage("Solicitação de recuperação de senha enviada com sucesso.");
    console.log("E-mail para recuperação:", email);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        component="form"
        onSubmit={handleSendRequest}
      >
        {/* Logo do sistema */}
        <Box mb={4}>
          <img src={logo} alt="Logo" style={{ width: "200px" }} />
        </Box>

        <Typography variant="h5" mb={2}>
          Recuperar Senha
        </Typography>

        {/* Campo para e-mail */}
        <TextField
          label="E-mail"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />

        {/* Botão para enviar solicitação */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Enviar
        </Button>

        {/* Mensagem de confirmação */}
        {message && (
          <Typography variant="body2" color="success" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default RecoverPass;
