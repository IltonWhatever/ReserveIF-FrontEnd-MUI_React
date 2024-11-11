import Menu from "../components/Menu";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true); // Para controle de carregamento
  const [error, setError] = useState(null); // Para capturar possíveis erros

  // Usando o hook useNavigate para redirecionar
  const navigate = useNavigate();

  // Função para buscar os dados dos laboratórios
  useEffect(() => {
    const token = localStorage.getItem("jwt"); // Recupera o token armazenado

    if (!token) {
      setError("Token não encontrado");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/reservables", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar laboratórios");
        }
        return response.json();
      })
      .then((data) => {
        setLabs(data); // Armazena os dados dos laboratórios no estado
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message); // Define o erro se a requisição falhar
        setLoading(false);
      });
  }, []);

  // Função para lidar com o clique no laboratório
  const handleClick = (labId) => {
    // Redireciona para a página de edição, passando o ID do laboratório como parâmetro
    navigate(`/edit-lab/${labId}`);
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          {/* Título */}
          <Typography
            variant="h5"
            sx={{
              marginBottom: "16px",
              fontWeight: "bold",
              paddingTop: "15px",
              paddingBot: "15px",
              justifyContent: "center",
            }}
          >
            Laboratórios
          </Typography>

          <Container>
            {/* Lista de laboratórios */}
            {labs.length === 0 ? (
              <Typography
                variant="body1"
                sx={{ color: "gray", textAlign: "center", marginTop: "20px" , paddingTop: "15px",
                  paddingBot: "15px",}}
              >
                Nenhum laboratório registrado.
              </Typography>
            ) : (
              <List>
                {labs.map((lab) => (
                  <ListItem
                    key={lab.id}
                    sx={{ borderBottom: "1px solid #ddd" }}
                  >
                    <ListItemButton onClick={() => handleClick(lab.id)}>
                      <ListItemText
                        primary={lab.name} // Nome do laboratório
                        secondary={lab.description} // Descrição do laboratório
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Container>
        </Container>
      </Container>
    </Box>
  );
};

export default Labs;
