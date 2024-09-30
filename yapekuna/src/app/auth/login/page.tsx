"use client"

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField, Typography } from '@mui/material';
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
    <div className='w-1/2'>
      <form onSubmit={formik.handleSubmit}>
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
        />
        <Button color="primary" variant="contained" fullWidth type="submit">
          Log In
        </Button>
        {errorMessage && (
          <Typography color="error" variant="body2" style={{ marginTop: '10px' }}>
            {errorMessage}
          </Typography>
        )}
      </form>
    </div>
  );
}
