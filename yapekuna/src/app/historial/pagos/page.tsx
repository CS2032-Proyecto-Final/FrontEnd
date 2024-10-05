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
        const storedId = localStorage.getItem('id'); // Recuperar el ID del localStorage
        const response = await GetPagos(storedId);
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
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <Typography variant="h4" className="text-center text-gray-800 font-bold mb-6">
        Historial de Pagos
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagos.map((pago, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <Typography variant="h5" className="text-blue-700 font-semibold mb-2">
              {pago.producto_nombre}
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              Destinatario: {pago.destinatario_nombre}
            </Typography>
            <Typography variant="body2" className="text-green-600 font-bold my-2">
              Monto: S/. {pago.monto}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Fecha: {pago.fecha}
            </Typography>
            <Typography variant="body2" className="text-gray-600 text-2xl">
              Código: {pago.codigo}
            </Typography>
          </div>
        ))}
      </div>
    </div>

  );
};

export default Pagos;
