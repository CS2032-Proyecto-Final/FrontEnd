"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { GetPersonaNombre, GetSaldo, Transferencia } from '../service/api'; // Importamos la API que conecta con Axios
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Dashboard = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [nombre, setNombre] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null); // Nuevo estado para los errores de la API

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
    formik.resetForm();
    setApiError(null); // Limpiar el error de la API al cerrar el diálogo
  };

  // Yup schema for validation
  const validationSchema = Yup.object({
    destinatario_numero: Yup.string()
      .matches(/^\d{9}$/, 'El número de cuenta debe tener 9 dígitos y contener solo números.')
      .required('El número de cuenta es obligatorio.'),
    monto: Yup.number()
      .positive('El monto debe ser positivo.')
      .max(500, 'El monto debe ser menor a 500.')
      .required('El monto es obligatorio.'),
    descripcion: Yup.string()
      .required('La descripción es obligatoria.')
  });

  const formik = useFormik({
    initialValues: {
      destinatario_numero: '',
      monto: 0,
      descripcion: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiError(null); // Limpiar el error de la API antes de intentar enviar
        if (!userId) throw new Error("Usuario no autenticado");

        await Transferencia(userId, values);
        setDialogOpen(false); // Cerrar el diálogo al completar la transferencia
      } catch (err: any) {
        setApiError(err.message); // Almacenar el error de la API en el nuevo estado
      } finally {
        setSubmitting(false);
      }
    }
  });

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
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Cuenta destinataria"
              name="destinatario_numero"
              fullWidth
              value={formik.values.destinatario_numero}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              className="bg-gray-100 rounded-lg"
              error={formik.touched.destinatario_numero && Boolean(formik.errors.destinatario_numero)}
              helperText={formik.touched.destinatario_numero && formik.errors.destinatario_numero}
            />
            <TextField
              label="Monto"
              name="monto"
              fullWidth
              type="number"
              value={formik.values.monto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              className="bg-gray-100 rounded-lg"
              error={formik.touched.monto && Boolean(formik.errors.monto)}
              helperText={formik.touched.monto && formik.errors.monto}
            />
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              type="text"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              className="bg-gray-100 rounded-lg"
              error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
              helperText={formik.touched.descripcion && formik.errors.descripcion}
            />
            {apiError && (
              <Typography variant="body2" color="error" className="text-red-500">
                {apiError}
              </Typography>
            )}
          </form>
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
            onClick={() => formik.handleSubmit()}
            color="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? <CircularProgress size={24} className="text-white" /> : 'Transferir'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
