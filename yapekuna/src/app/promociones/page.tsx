"use client"

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { GetPromociones, GetPromocion, PagarPromocion } from '../service/api'; // Funciones de la API

const Promociones = () => {
  const [promociones, setPromociones] = useState<any[]>([]);
  const [selectedPromocion, setSelectedPromocion] = useState<any | null>(null); // Promoción seleccionada
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false); // Para mostrar carga durante el pago
  const [success, setSuccess] = useState<boolean>(false); // Indica si el pago fue exitoso
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const promocionesResponse = await GetPromociones();
        setPromociones(promocionesResponse);
      } catch (err) {
        setError('Error al obtener las promociones');
      } finally {
        setLoading(false);
      }
    };

    fetchPromociones();
  }, []);

  const handleSelectPromocion = async (promocionId: string) => {
    try {
      const promocionData = await GetPromocion(promocionId);
      setSelectedPromocion(promocionData); // Mostrar los detalles de la promoción en el pop-up
    } catch (err) {
      setError('Error al obtener los detalles de la promoción');
    }
  };

  const handlePagarPromocion = async (promocionId: string) => {
    setIsPaying(true);
    try {
      const storedId:string | null = localStorage.getItem('id'); // Recuperar el ID del localStorage
      if (storedId) {
        setUserId(storedId);
        const pagoResponse = await PagarPromocion(promocionId, storedId);
        setSuccess(true); // Muestra la pantalla de éxito si el pago fue exitoso
      }    
    } catch (err: any) {
      setError(err.message); // Muestra los errores en caso de que algo falle
    } finally {
      setIsPaying(false);
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
        Promociones Disponibles
      </Typography>
      <Grid container spacing={2}>
        {promociones.map((promocion, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {promocion.nombre_tienda}
                </Typography>
                <Typography variant="body1">
                  Producto: {promocion.nombre_producto}
                </Typography>
                <Typography variant="body2">
                  Precio: S/. {promocion.precio}
                </Typography>
                <Typography variant="body2">
                  Descuento: {promocion.descuento}%
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleSelectPromocion(promocion.id)}
                >
                  Ver detalles
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialogo para mostrar los detalles de la promoción seleccionada */}
      <Dialog
        open={!!selectedPromocion}
        onClose={() => setSelectedPromocion(null)}
      >
        <DialogTitle>Detalles de la Promoción</DialogTitle>
        <DialogContent>
          {selectedPromocion ? (
            <>
              <Typography variant="h6">
                {selectedPromocion.nombre_tienda}
              </Typography>
              <Typography variant="body1">
                Producto: {selectedPromocion.nombre_producto}
              </Typography>
              <Typography variant="body2">
                Precio: S/. {selectedPromocion.precio}
              </Typography>
              <Typography variant="body2">
                Descuento: {selectedPromocion.descuento}%
              </Typography>
              <Typography variant="body2">
                Descripción: {selectedPromocion.descripcion}
              </Typography>
              <Typography variant="body2">
                Vigencia: {selectedPromocion.dia_inicial} - {selectedPromocion.dia_final}
              </Typography>
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectedPromocion(null)}
            color="secondary"
          >
            Cerrar
          </Button>
          <Button
            onClick={() => handlePagarPromocion(selectedPromocion.id)}
            color="primary"
            disabled={isPaying}
          >
            {isPaying ? <CircularProgress size={24} /> : 'Pagar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pantalla de confirmación */}
      <Dialog
        open={success}
        onClose={() => setSuccess(false)}
      >
        <DialogTitle>Pago exitoso</DialogTitle>
        <DialogContent>
          <Typography variant="h6">¡Transferencia Correcta!</Typography>
          <Typography variant="body1">
            El pago de la promoción fue procesado con éxito.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSuccess(false);
              setSelectedPromocion(null); // Cerramos la ventana
            }}
            color="primary"
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Promociones;
