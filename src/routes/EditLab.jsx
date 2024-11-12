import React, { useState, useEffect } from "react";
import { Box, Container, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";
import { jwtDecode  } from 'jwt-decode';

const EditLab = () => {
  const { id } = useParams();
  const [lab, setLab] = useState({
    name: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Estado para abrir/fechar o modal de deletar

  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  let isAdmin = false;
  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.groups.includes("Administrador");
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchLabData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/reservables/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const labData = await response.json();
          setLab(labData);
        } else {
          setError("Erro ao carregar o laboratório.");
        }
      } catch (error) {
        setError("Erro ao carregar o laboratório.");
      } finally {
        setLoading(false);
      }
    };

    fetchLabData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLab({
      ...lab,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/reservables/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(lab),
      });

      if (response.ok) {
        navigate("/labs");
      } else {
        setError("Erro ao atualizar o laboratório.");
      }
    } catch (error) {
      setError("Erro ao atualizar o laboratório.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/reservables/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate("/labs");
      } else {
        setError("Erro ao deletar o laboratório.");
      }
    } catch (error) {
      setError("Erro ao deletar o laboratório.");
    }
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteModal(false);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteModal(true);
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
              marginBottom: "16px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Editar Laboratório
          </Typography>

          {loading ? (
            <Typography>Carregando...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Nome do laboratório */}
              <TextField
                fullWidth
                label="Nome do Laboratório"
                variant="outlined"
                margin="normal"
                name="name"
                value={lab.name}
                onChange={handleChange}
                required
                disabled={!isAdmin}
              />

              {/* Localização do laboratório */}
              <TextField
                fullWidth
                label="Localização"
                variant="outlined"
                margin="normal"
                name="location"
                value={lab.location}
                onChange={handleChange}
                required
                disabled={!isAdmin}
              />

              {/* Botões */}
              {isAdmin && (<Box sx={{ textAlign: "center", marginTop: "20px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    backgroundColor: "#1F2732",
                    "&:hover": { backgroundColor: "#3c475a" },
                    marginRight: "10px",
                  }}
                >
                  Atualizar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleOpenDeleteDialog}
                  sx={{ marginLeft: "10px" }}
                >
                  Deletar
                </Button>
              </Box>)}
            </form>
          )}
        </Container>
      </Container>

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={openDeleteModal}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Confirmar Deleção</DialogTitle>
        <DialogContent>
          <Typography>
            Você tem certeza que deseja deletar este laboratório? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditLab;
