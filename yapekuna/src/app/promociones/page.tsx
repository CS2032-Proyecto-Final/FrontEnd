"use client"

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { GetPromociones, GetPromocion, PagarPromocion } from '../service/api'; // Funciones de la API
import { Promocion } from '../interfaces/interfaces';

const Promociones = () => {
  const [promociones, setPromociones] = useState<any[]>([]);
  const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null); // Promoción seleccionada
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
      setSelectedPromocion({id: promocionId, ...promocionData}); // Mostrar los detalles de la promoción en el pop-up
    } catch (err) {
      setError('Error al obtener los detalles de la promoción');
    }
  };

  const handlePagarPromocion = async (promocionId: string | undefined) => {
    setIsPaying(true);
    try {
      const storedId:string | null = localStorage.getItem('id'); // Recuperar el ID del localStorage
      if (storedId && promocionId) {
        setUserId(storedId);
        const pagoResponse = await PagarPromocion(promocionId, storedId);
        console.log(pagoResponse);
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
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <Typography variant="h4" className="text-center text-gray-800 font-bold mb-6">
        Promociones Disponibles
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {promociones.map((promocion, index) => {
          const precioOriginal = promocion.precio;
          const precioDescuento = (promocion.precio * (1 - promocion.descuento / 100)).toFixed(2);

          return (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Typography variant="h6" className="text-blue-700 font-semibold">
                {promocion.nombre_tienda}
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                Producto: {promocion.nombre_producto}
              </Typography>
              <div className="my-2">
                <Typography variant="body2" className="text-gray-500 line-through">
                  Precio original: S/. {precioOriginal}
                </Typography>
                <Typography variant="body2" className="text-green-600 font-bold">
                  Precio con descuento: S/. {precioDescuento}
                </Typography>
              </div>
              <Typography variant="body2" className="text-gray-600">
                Descuento: {promocion.descuento}%
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className="bg-blue-600 hover:bg-blue-700 text-white mt-4 py-2 rounded-lg"
                onClick={() => handleSelectPromocion(promocion.id)}
              >
                Ver detalles
              </Button>
            </div>
          );
        })}
      </div>

      {/* Dialogo para mostrar los detalles de la promoción seleccionada */}
      <Dialog open={!!selectedPromocion} onClose={() => setSelectedPromocion(null)} className='w1/3'>
        <DialogTitle className="text-lg font-semibold">Detalles de la Promoción</DialogTitle>
        <DialogContent>
          {selectedPromocion ? (
            <>
              <Typography variant="h6" className="text-blue-700">
                {selectedPromocion.nombre_tienda}
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                Producto: {selectedPromocion.nombre_producto}
              </Typography>
              <div className="my-2">
                <Typography variant="body2" className="text-gray-500 line-through">
                  Precio original: S/. {selectedPromocion.precio}
                </Typography>
                <Typography variant="body2" className="text-green-600 font-bold">
                  Precio con descuento: S/. {(selectedPromocion.precio * (1 - selectedPromocion.descuento / 100)).toFixed(2)}
                </Typography>
              </div>
              <Typography variant="body2" className="text-gray-600">
                Descuento: {selectedPromocion.descuento}%
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Vigencia: {selectedPromocion.dia_inicio} - {selectedPromocion.dia_final}
              </Typography>
              {error && (
                <Typography variant="body2" color="error" className="text-red-500 mt-2">
                  {error}
                </Typography>
              )}
            </>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPromocion(null)} color="secondary" className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg">
            Cerrar
          </Button>
          <Button
            onClick={() => handlePagarPromocion(selectedPromocion?.id)}
            color="primary"
            disabled={isPaying}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            {isPaying ? <CircularProgress size={24} className="text-white" /> : 'Pagar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pantalla de confirmación */}
      <Dialog open={success} onClose={() => setSuccess(false)} className=''>
        <DialogTitle className="text-lg font-semibold">Pago exitoso</DialogTitle>
        <DialogContent>
          <Typography variant="h6" className="text-green-600 font-bold">¡Transferencia Correcta!</Typography>
          <Typography variant="body1" className="text-gray-700">
            El pago de la promoción fue procesado con éxito.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSuccess(false);
              setSelectedPromocion(null);
            }}
            color="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>

  );
};

export default Promociones;
