"use client"

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Link, Typography } from '@mui/material';
import { TextField } from '@mui/material';

import { RegisterForm, Id } from '@/app/interfaces/interfaces';
import { AuthRegister } from '@/app/service/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const validationSchema = yup.object({
  nombre: yup
    .string()
    .matches(/^[a-zA-Z ]+$/, "Nombre debe tener solo letras")
    .required('Nombre es requerido'),
  telefono: yup
    .string()
    .matches(/^[0-9]+$/, "Número Telefónico solo debe tener dígitos")
    .test('len', 'Debe tener 9 dígitos', (val) => val?.length === 9)
    .required('Número Telefónico es requerido'),
});
  
export default function Register(){
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean> (false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (values: RegisterForm) => AuthRegister(values),
    onError: (error:any) => {
      if(error.response?.status === 409) {
        setErrorMessage("Ya existe un usuario con ese teléfono");
      }
      else if (error.response?.status === 500){
        setErrorMessage("Error de servidor. Intente más tarde");
      }
      else {
        setErrorMessage("No se pudo conectar al server");
      }
    },
    onSuccess: (data) => {
      setErrorMessage(null);
      router.push('/auth/login')
    }
  })

  const formik = useFormik({
    initialValues: {
      nombre: '',
      telefono: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values : RegisterForm) => {
        setErrorMessage(null);
        setLoading(true);
        mutation.mutate(values);

    },
  });

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Typography className='flex justify-center text-3xl m-5'>
          Bienvenido a Yapekuna
        </Typography>
        <div>
          <TextField
            fullWidth
            id="nombre"
            name="nombre"
            label="Nombre"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
            margin="normal"
            className="bg-white rounded-md"
          />
        </div>

        <div>
          <TextField
            fullWidth
            id="telefono"
            name="telefono"
            label="Teléfono"
            type="tel"
            value={formik.values.telefono}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.telefono && Boolean(formik.errors.telefono)}
            helperText={formik.touched.telefono && formik.errors.telefono}
            margin="normal"
            className="bg-white rounded-md"
          />
        </div>

        {errorMessage && (
          <Typography
            color="error"
            variant="body2"
            className="text-red-500 mt-2 text-center"
          >
            {errorMessage}
          </Typography>
        )}

        <Button
          color="primary"
          variant="contained"
          disabled = {loading}
          fullWidth
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-5"
        >
          Registrarse
        </Button>
          <div className="flex justify-center mt-4">
            <Link className="hover:text-blue-800" onClick={() => router.push('/auth/login')}>
              ¿Ya tienes una cuenta?
            </Link>
          </div>
      </form>
    </div>
  );
};
