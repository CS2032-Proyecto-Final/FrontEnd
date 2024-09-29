"use client"

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';
import { GetPagos } from '../../service/api'; // Importamos la función que conecta con Axios
import { Pago } from '@/app/interfaces/interfaces';


const Pagos = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await GetPagos();
        setPagos(response); // Asumimos que la API devuelve un array de pagos
      } catch (err) {
        setError('Error al obtener los pagos');
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

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
        Historial de Pagos
      </Typography>
      <Grid container spacing={2}>
        {pagos.map((pago, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {pago.producto_nombre}
                </Typography>
                <Typography variant="body1">
                  Destinatario: {pago.destinatario_nombre}
                </Typography>
                <Typography variant="body2">
                  Monto: S/. {pago.monto}
                </Typography>
                <Typography variant="body2">
                  Fecha: {pago.fecha}
                </Typography>
                <Typography variant="body2">
                  Código: {pago.codigo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Pagos;
