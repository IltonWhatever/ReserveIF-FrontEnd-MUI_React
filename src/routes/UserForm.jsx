import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Input,
  FormHelperText,
} from "@mui/material";

// Tipos de usuário definidos no enum
const typeUserOptions = [
  { value: "Professor", label: "Professor" },
  { value: "Administrador", label: "Administrador" },
];
import { useNavigate } from "react-router-dom";

function UserForm() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    identificationCode: "",
    typeUser: "",
  });

  const [image, setImage] = useState(null); // Estado para armazenar a imagem
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(""); // Erro para o campo de imagem

  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (formValues.firstName.length < 2) {
      tempErrors.firstName = "Deve ter ao menos 2 caracteres";
      isValid = false;
    }
    if (formValues.lastName.length < 2) {
      tempErrors.lastName = "Deve ter ao menos 2 caracteres";
      isValid = false;
    }
    if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      tempErrors.email = "Email inválido";
      isValid = false;
    }
    if (formValues.password.length < 5) {
      tempErrors.password = "Senha deve ter ao menos 5 caracteres";
      isValid = false;
    }
    if (formValues.identificationCode === "") {
      tempErrors.identificationCode = "Digite o código SUAP";
      isValid = false;
    }
    if (formValues.typeUser === "") {
      tempErrors.typeUser = "Informe se o usuário é professor ou administrador";
      isValid = false;
    }
    if (!image) {
      setImageError("É necessário anexar uma imagem (JPEG ou PNG)");
      isValid = false;
    } else {
      setImageError("");
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      // Crie o objeto userRequest com todos os dados
      const userRequest = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
        identificationCode: formValues.identificationCode,
        typeUser: formValues.typeUser,
      };
    
      // Crie um FormData para enviar a imagem
      const formData = new FormData();
    
      // Adicione o objeto userRequest como JSON para o FormData
      formData.append("userRequest", JSON.stringify(userRequest)); // O objeto userRequest é convertido em JSON
    
      // Adicionar a imagem ao FormData
      formData.append("image", image); // 'image' é a chave que será usada no backend para receber o arquivo
    
      // Exemplo de chamada para API (usando fetch)
      fetch("http://localhost:8080/users/", {
        method: "POST",
        body: formData, // Enviando o FormData
      })
      .then((response) => {
        if (!response.ok) {
          // Se a resposta não for 2xx, trata o erro
          throw new Error("Erro na requisição");
        }
    
        // Se o código de status for 201, podemos apenas confirmar o sucesso
        if (response.status === 201) {
          console.log("Usuário criado com sucesso!");
          // Aqui você pode redirecionar ou exibir uma mensagem de sucesso
        }
      })
      .then((data) => {
        // Caso o registro seja bem-sucedido, redireciona para a página de login com uma mensagem
        navigate("/login", {
          state: { successMessage: "Usuário registrado com sucesso!" }, // Passa a mensagem
        });
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
    }    
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handler para o upload de imagem
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]); // Armazena a imagem no estado
      setImageError(""); // Limpa o erro quando o usuário seleciona uma imagem
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, margin: "auto", padding: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Formulário de Cadastro
      </Typography>

      {/* Nome */}
      <TextField
        fullWidth
        label="Nome"
        name="firstName"
        value={formValues.firstName}
        onChange={handleInputChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
        margin="normal"
      />

      {/* Sobrenome */}
      <TextField
        fullWidth
        label="Sobrenome"
        name="lastName"
        value={formValues.lastName}
        onChange={handleInputChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
        margin="normal"
      />

      {/* Email */}
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formValues.email}
        onChange={handleInputChange}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
      />

      {/* Senha */}
      <TextField
        fullWidth
        label="Senha"
        name="password"
        type="password"
        value={formValues.password}
        onChange={handleInputChange}
        error={!!errors.password}
        helperText={errors.password}
        margin="normal"
      />

      {/* Código de Identificação (SUAP) */}
      <TextField
        fullWidth
        label="Código SUAP"
        name="identificationCode"
        value={formValues.identificationCode}
        onChange={handleInputChange}
        error={!!errors.identificationCode}
        helperText={errors.identificationCode}
        margin="normal"
      />

      {/* Tipo de Usuário */}
      <TextField
        select
        fullWidth
        label="Tipo de Usuário"
        name="typeUser"
        value={formValues.typeUser}
        onChange={handleInputChange}
        error={!!errors.typeUser}
        helperText={errors.typeUser}
        margin="normal"
      >
        {typeUserOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Upload da Imagem */}
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        Upload da Imagem de Perfil (JPEG ou PNG)
      </Typography>
      <Input
        type="file"
        inputProps={{ accept: "image/jpeg, image/png" }}
        onChange={handleImageChange}
        fullWidth
        sx={{ marginTop: 1 }}
      />
      {imageError && <FormHelperText error>{imageError}</FormHelperText>}

      {/* Botão de Enviar */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        sx={{
          marginTop: 2,
          backgroundColor: "green",
          "&:hover": {
            backgroundColor: "darkgreen",
          },
        }}
      >
        Enviar
      </Button>
    </Box>
  );
}

export default UserForm;
