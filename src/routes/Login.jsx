import React, { useState } from "react";
import logo from "../assets/logo.png";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // Estado para armazenar os erros de validação

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!username) {
      tempErrors.username = "Código SIAPE é obrigatório";
      isValid = false;
    }

    if (!password) {
      tempErrors.password = "Senha é obrigatória";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validate()) {
      // Lógica para login (ex: validação, requisição API)
      console.log("Usuário:", username);
      console.log("Senha:", password);
    }
  };

  const navigate = useNavigate();

  const goToUserForm = () => {
    navigate('/UserForm');
    console.log('Redirecionando para Formulario');
  }

  const handleForgotPassword = () => {
    // Lógica para redirecionar à página de recuperação de senha
    console.log('Redirecionando para recuperação de senha...');
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
        onSubmit={handleLogin}
      >
        <Box mb={4}>
          <img src={logo} alt="Logo" style={{ width: "250px" }} />
        </Box>
        <TextField
          label="Código SIAPE"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!errors.username} // Exibe erro se houver
          helperText={errors.username} // Exibe mensagem de erro
        />
        <TextField
          label="Senha"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password} // Exibe erro se houver
          helperText={errors.password} // Exibe mensagem de erro
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: "green",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }}
        >
          Entrar
        </Button>

        <Box mt={2} display="flex" justifyContent="space-between" width="100%">
          <Button color="primary" onClick={handleForgotPassword}>
            Esqueceu a senha?
          </Button>
          <Button color="secondary" onClick={goToUserForm}>
            Registrar-se
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginForm;
