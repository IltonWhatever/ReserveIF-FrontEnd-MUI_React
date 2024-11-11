import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import CheckIcon from '@mui/icons-material/Check';

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(""); // Estado para mensagem de erro de login
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage; // Acessa a mensagem de sucesso, se existir

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
    setLoginError(""); // Limpa mensagens de erro anteriores
    if (validate()) {
      const data = {
        emailOrCode: username,
        password: password,
      };

      // JSON enviado para API assim como no Insomia
      fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro na requisição");
          }
          return response.json();
        })
        .then((responseData) => {
          localStorage.setItem("jwt", responseData.jwt);
          // Forçar recarregamento da página
          window.location.reload(); // Isso recarrega a página inteira
          navigate("/DashBoard"); // Redireciona para o Dashboard
        })
        .catch((error) => {
          console.error("Erro:", error);
          setLoginError("Credenciais inválidas ou erro de conexão.");
        });
    }
  };

  const goToUserForm = () => {
    navigate("/UserForm");
  };

  const handleForgotPassword = () => {
    navigate("/RecoverPass");
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
        {successMessage && (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            {successMessage}
          </Alert>
        )}
        <TextField
          label="Código SIAPE"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          label="Senha"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />

        {loginError && (
          <Typography color="error" variant="body2" align="center" mt={2}>
            {loginError}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: "10px",
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
