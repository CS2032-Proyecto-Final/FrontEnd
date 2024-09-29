"use client";

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Componente para el NavBar
const NavBar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Elimina el ID del usuario del localStorage
    router.push('/login'); // Redirige al login después de hacer logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => router.push('/dashboard')} // Al hacer clic en el logo, redirige al dashboard
        >
          {/* Puedes colocar aquí un logo o solo el nombre de la empresa */}
          Yapekuna
          {/*<img src="/logo.png" alt="Logo de la Empresa" style={{ height: '40px' }} />*/} {/* Logo de la empresa */}
        </Typography>

        {/* Botón para ir al dashboard */}
        <Button color="inherit" onClick={() => router.push('/dashboard')}>
          Dashboard
        </Button>

        {/* Botón para hacer logout */}
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;