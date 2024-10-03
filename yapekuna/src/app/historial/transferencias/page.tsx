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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransferencias = async () => {
      try {
        const storedId = localStorage.getItem('id'); // Recuperar el ID del localStorage
        let destinatariosResponse = [];
        let remitentesResponse = [];
        if (storedId) {
          setUserId(storedId);
          destinatariosResponse = await GetDestinatarios(storedId);
          remitentesResponse = await GetRemitentes(storedId);          
        }
        
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
        Transferencias Recientes
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {transferencias.map((transferencia, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <Typography variant="h6" className="text-blue-700 font-semibold mb-2">
              {transferencia.nombre}
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              Descripción: {transferencia.descripcion}
            </Typography>
            <Typography
              variant="body2"
              className={`font-bold my-2 ${transferencia.tipo === 'destinatario' ? 'text-red-600' : 'text-green-600'}`}
            >
              Monto: {transferencia.tipo === 'destinatario' ? '-' : ''}S/. {Math.abs(transferencia.monto)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Fecha: {transferencia.fecha}
            </Typography>
          </div>
        ))}
      </div>
    </div>

  );
};

export default Transferencias;
