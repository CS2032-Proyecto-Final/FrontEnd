"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { GetPersonaNombre, GetSaldo, Transferencia } from '../service/api'; // Importamos la API que conecta con Axios
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
  const [nombre, setNombre] = useState<string | null>(null);

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
    const fetchNombre = async () => {
      try {
        const storedId = localStorage.getItem('id'); // Recuperar el ID del localStorage
        if (storedId) {
          setUserId(storedId);
          const fetchedNombre = await GetPersonaNombre(storedId);
          setNombre(fetchedNombre);
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener el nombre");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSaldo();
    fetchNombre();
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
      [name]: name === 'monto' ? Number(value) : value // Convertir a número solo si el nombre es 'monto'
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
    <div className="w-30 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <Typography variant="h4" gutterBottom className="text-center text-gray-800 font-bold">
        Bienvenido, {nombre}
      </Typography>
      <Typography variant="h5" gutterBottom className="text-center text-gray-600">
        Tu cuenta bancaria: S/. {saldo}
      </Typography>

      <div className="mt-6 space-y-4">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          onClick={() => router.push('/promociones')}
        >
          Promociones
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          onClick={() => router.push('/historial/transferencias')}
        >
          Ver historial de transferencias
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          onClick={() => router.push('/historial/pagos')}
        >
          Registro de pagos
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          onClick={handleOpenDialog}
        >
          Realizar transferencias
        </Button>
      </div>

      {/* Diálogo para realizar transferencias */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        className="rounded-lg"
      >
        <DialogTitle className="text-xl font-semibold">Realizar Transferencia</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            label="Cuenta destinataria"
            name="destinatario_numero"
            fullWidth
            value={transferForm.destinatario_numero}
            onChange={handleTransferChange}
            margin="normal"
            className="bg-gray-100 rounded-lg"
          />
          <TextField
            label="Monto"
            name="monto"
            fullWidth
            type="number"
            value={transferForm.monto}
            onChange={handleTransferChange}
            margin="normal"
            className="bg-gray-100 rounded-lg"
          />
          <TextField
            label="Descripción"
            name="descripcion"
            fullWidth
            type="text"
            value={transferForm.descripcion}
            onChange={handleTransferChange}
            margin="normal"
            className="bg-gray-100 rounded-lg"
          />
          {transferError && (
            <Typography variant="body2" color="error" className="text-red-500">
              {transferError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitTransfer}
            color="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            disabled={isTransfering}
          >
            {isTransfering ? <CircularProgress size={24} className="text-white" /> : 'Transferir'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>

  );
};

export default Dashboard;
