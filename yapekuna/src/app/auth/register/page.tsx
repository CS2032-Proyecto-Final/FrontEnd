"use client"

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Typography } from '@mui/material';
import { TextField } from '@mui/material';

import { RegisterForm, Id } from '@/app/interfaces/interfaces';
import { AuthRegister } from '@/app/service/api';
import { useMutation } from '@tanstack/react-query';

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
      console.log(data.id);
      setErrorMessage(null);
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
        mutation.mutate(values);
    },
  });

  return (
    <div className='w-1/2'>
        <form onSubmit={formik.handleSubmit}>
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
            />
            <TextField
                fullWidth
                id="telefono"
                name="telefono"
                label="Teléfono"
                type="telefono"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                helperText={formik.touched.telefono && formik.errors.telefono}
            />
            {errorMessage && (
              <Typography color="error" variant="body2" style={{ marginTop: '10px' }}>
                {errorMessage}
              </Typography>
            )}
            <Button color="primary" variant="contained" fullWidth type="submit">
                Registrarse
            </Button>
        </form>
    </div>
  );
};
