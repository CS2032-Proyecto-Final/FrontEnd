"use client"

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Link, TextField, Typography } from '@mui/material';
import { LoginForm } from '@/app/interfaces/interfaces';
import { AuthLogin } from '@/app/service/api';
import { useRouter } from 'next/navigation';

// Esquema de validación para el formulario
const validationSchema = yup.object({
  telefono: yup
    .string()
    .matches(/^[0-9]{9}$/, "Debe ser un número de teléfono válido de 9 dígitos")
    .required('El teléfono es requerido'),
});

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para manejar los errores

  const formik = useFormik({
    initialValues: {
      telefono: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values: LoginForm) => {
      try {
        const response: any = await AuthLogin(values);
        localStorage.setItem("id", response.id);
        router.push('/dashboard');
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    },
  });

  return (
  <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg flex justify-center mt-10">
    <form onSubmit={formik.handleSubmit} className="">
      <Typography className='flex justify-center text-3xl m-5'>
        Ingresa a Yapekuna
      </Typography>
      <div>
        <TextField
          fullWidth
          id="telefono"
          name="telefono"
          label="Teléfono"
          type="text"
          value={formik.values.telefono}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.telefono && Boolean(formik.errors.telefono)}
          helperText={formik.touched.telefono && formik.errors.telefono}
          margin="normal"
          className="bg-white rounded-md"
        />
      </div>
  
      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-5"
      >
        Log In
      </Button>
  
      {errorMessage && (
        <Typography
          color="error"
          variant="body2"
          className="text-red-500 mt-2 text-center"
        >
          {errorMessage}
        </Typography>
      )}
  
      <div className="flex justify-center mt-4">
        <Link href="/auth/register" className="hover:text-blue-800">
          ¿Aún no tienes una cuenta?
        </Link>
      </div>
    </form>
  </div>
  
  );
}
