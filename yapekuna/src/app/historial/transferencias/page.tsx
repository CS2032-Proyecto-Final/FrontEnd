"use client"

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';
import { GetDestinatarios, GetRemitentes } from '../../service/api'; // Importamos las funciones de Axios
import { useRouter } from 'next/navigation';

interface Transferencia {
  nombre: string;
  monto: number;
  fecha: string;
  descripcion: string;
  tipo: 'destinatario' | 'remitente'; // Para diferenciar entre destinatarios y remitentes
}

const Transferencias = () => {
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = '1'; // Se debe obtener del contexto o localStorage

  useEffect(() => {
    const fetchTransferencias = async () => {
      try {
        const destinatariosResponse = await GetDestinatarios(userId);
        const remitentesResponse = await GetRemitentes(userId);

        // Unimos destinatarios y remitentes en un solo array y los ordenamos por fecha
        const allTransferencias: Transferencia[] = [
          ...destinatariosResponse.map((d:any) => ({
            ...d,
            nombre: d.nombre_destinatario,
            monto: -d.monto, // Monto negativo para indicar que es un pago realizado
            tipo: 'destinatario',
          })),
          ...remitentesResponse.map((r:any) => ({
            ...r,
            nombre: r.nombre_remitente,
            tipo: 'remitente',
          })),
        ];

        // Ordenamos por fecha (más reciente primero)
        allTransferencias.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        setTransferencias(allTransferencias); // Almacena todas las transferencias juntas
      } catch (err) {
        setError('Error al obtener las transferencias');
      } finally {
        setLoading(false);
      }
    };

    fetchTransferencias();
  }, [userId]);

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
        Transferencias Recientes
      </Typography>
      <Grid container spacing={2}>
        {transferencias.map((transferencia, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {transferencia.nombre}
                </Typography>
                <Typography variant="body1">
                  Descripción: {transferencia.descripcion}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: transferencia.tipo === 'destinatario' ? 'red' : 'black', // Rojo para pagos realizados
                  }}
                >
                  Monto: {transferencia.tipo === 'destinatario' ? '-' : ''}S/. {Math.abs(transferencia.monto)}
                </Typography>
                <Typography variant="body2">
                  Fecha: {transferencia.fecha}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Transferencias;
