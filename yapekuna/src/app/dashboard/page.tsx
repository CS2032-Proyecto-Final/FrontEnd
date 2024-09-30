"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { GetSaldo, Transferencia } from '../service/api'; // Importamos la API que conecta con Axios
import { useRouter } from 'next/navigation';
import { TransferForm } from '../interfaces/interfaces';

const Dashboard = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [transferForm, setTransferForm] = useState<TransferForm>({
    destinatario_numero: '',
    monto: 0,
    descripcion: '',
  });
  const [transferError, setTransferError] = useState<string | null>(null);
  const [isTransfering, setIsTransfering] = useState<boolean>(false);

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const storedId = localStorage.getItem('id'); // Recuperar el ID del localStorage
        if (storedId) {
          setUserId(storedId);
          const fetchedSaldo = await GetSaldo(storedId);
          setSaldo(fetchedSaldo);
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener el saldo");
      } finally {
        setLoading(false);
      }
    };

    fetchSaldo();
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTransferForm({
      destinatario_numero: '',
      monto: 0,
      descripcion: ''
    });
    setTransferError(null);
  };

  const handleTransferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransferForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmitTransfer = async () => {
    setIsTransfering(true);
    setTransferError(null);
    try {
      if (!userId) throw new Error("Usuario no autenticado");

      await Transferencia(userId, transferForm);
      setDialogOpen(false); // Cerrar el diálogo al completar la transferencia
    } catch (err: any) {
      setTransferError(err.message);
    } finally {
      setIsTransfering(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tu cuenta bancaria: S/. {saldo} 
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => router.push('/promociones')}
        >
          Promociones
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => router.push('/historial/transferencias')}
        >
          Ver historial de transferencias
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => router.push('/historial/pagos')}
        >
          Registro de pagos
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleOpenDialog}
        >
          Realizar transferencias
        </Button>
      </Box>

      {/* Dialogo para realizar transferencias */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Realizar Transferencia</DialogTitle>
        <DialogContent>
          <TextField
            label="Cuenta destinataria"
            name="destinatario_numero"
            fullWidth
            value={transferForm.destinatario_numero}
            onChange={handleTransferChange}
            margin="normal"
          />
          <TextField
            label="Monto"
            name="monto"
            fullWidth
            type="number"
            value={transferForm.monto}
            onChange={handleTransferChange}
            margin="normal"
          />
          <TextField
            label="Descripcion"
            name="descripcion"
            fullWidth
            type="text"
            value={transferForm.descripcion}
            onChange={handleTransferChange}
            margin="normal"
          />
          {transferError && (
            <Typography variant="body2" color="error">
              {transferError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitTransfer}
            color="primary"
            disabled={isTransfering}
          >
            {isTransfering ? <CircularProgress size={24} /> : 'Transferir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
