import axios from "axios";
import type { RegisterForm, Id, LoginForm, TransferForm, PagoForm } from "../interfaces/interfaces";

// URLs base para cada microservicio
const URL_MC: string = "http://localhost:8080";
const URL_MM: string = "http://localhost:8000";
const URL_MO: string = "http://localhost:8001";
const URL_MP: string = "http://localhost:8002";

// ---- MC ----

// POST /auth/register
export const AuthRegister = async (registerForm: RegisterForm) => {
  try {
    const response = await axios.post(`${URL_MC}/auth/register`, registerForm);
    return response.data; // Devuelve { id }
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error("Ya existe un usuario con ese teléfono");
    }
    throw error;
  }
};

// POST /auth/login
export const AuthLogin = async (loginForm: LoginForm) => {
  return {"id": 1};
  try {
    const response = await axios.post(`${URL_MC}/auth/login`, loginForm);
    return response.data; // Devuelve { id }
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error("No existe un usuario con ese teléfono");
    }
    throw error;
  }
};

// GET /cuenta/{id}/saldo
export const GetSaldo = async (id: string | null) => {
  if(!id) return {"saldo": 0};
  try {
    const response = await axios.get(`${URL_MC}/cuenta/${id}/saldo`);
    return response.data.saldo; // Devuelve { saldo }
  } catch (error) {
    throw error;
  }
};

// ---- MO ----

// POST /movimiento/transferencia/{remitente_id}
export const Transferencia = async (remitente_id: string, transferForm: TransferForm) => {
  
  return { status: 200 };
  
  try {
    const response = await axios.post(`${URL_MO}/movimiento/transferencia/${remitente_id}`, transferForm);
    return response.data; // Status 200
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("No existe usuario");
    }
    if (error.response?.status === 401) {
      throw new Error("No tienes suficiente saldo");
    }
    throw error;
  }
};

// ---- MM ----

// GET /transferencias/cliente/{id}/destinatarios
export const GetDestinatarios = async (id: string) => {
  return [
    { nombre_destinatario: "Juan Perez", monto: 500, fecha: "2024-09-27", descripcion: "Transferencia" },
    { nombre_destinatario: "Maria Lopez", monto: 300, fecha: "2024-09-28", descripcion: "Pago de servicios" },
  ];

  try {
    const response = await axios.get(`${URL_MM}/transferencias/cliente/${id}/destinatarios`);
    return response.data; // Devuelve List<{nombre_destinatario, monto, fecha, descripcion}>
  } catch (error) {
    throw error;
  }
};

// GET /transferencias/cliente/{id}/remitentes
export const GetRemitentes = async (id: string) => {
  return [
    { nombre_remitente: "Michael Hinojosa", monto: 400, fecha: "2024-09-26", descripcion: "Te debo" },
    { nombre_remitente: "Mikel Bracamonte", monto: 200, fecha: "2024-09-28", descripcion: "Pagado" },
  ];

  try {
    const response = await axios.get(`${URL_MM}/transferencias/cliente/${id}/destinatarios`);
    return response.data; // Devuelve List<{nombre_remitente, monto, fecha, descripcion}>
  } catch (error) {
    throw error;
  }
};

// ---- MP ----

// GET /promociones/
export const GetPromociones = async () => {
  return [
    { id: "1", nombre_tienda: "Tienda A", nombre_producto: "Producto 1", descuento: 10, precio: 100 },
    { id: "2", nombre_tienda: "Tienda B", nombre_producto: "Producto 2", descuento: 20, precio: 200 },
  ];
  
  try {
    const response = await axios.get(`${URL_MP}/promociones`);
    return response.data; // Devuelve List<{id, nombre_tienda, nombre_producto, descuento, precio}>
  } catch (error) {
    throw error;
  }
};

// GET /promocion/{id}
export const GetPromocion = async (id: string) => {
  return { nombre_tienda: "Tienda A", nombre_producto: "Producto 1", descuento: 10, precio: 100, descripcion: "Descripción del producto", dia_inicial: "2024-09-01", dia_final: "2024-09-30" };
  
  try {
    const response = await axios.get(`${URL_MP}/promocion/${id}`);
    return response.data; // Devuelve {nombre_tienda, nombre_producto, descuento, precio, descripcion, dia_inicial, dia_final}
  } catch (error) {
    throw error;
  }
};

// POST /movimiento/pago/promocion/{id}
export const PagarPromocion = async (id: string, persona_id: string) => {
  return { codigo: "PROMO123" };
  try {
    const response = await axios.post(`${URL_MO}/movimiento/pago/promocion/${id}`, { persona_id });
    return response.data.codigo; // Devuelve {codigo}
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (error.response.data.error === "No hay saldo") {
        throw new Error("No tienes suficiente saldo");
      }
      if (error.response.data.error === "Promocion fuera vigencia") {
        throw new Error("La promoción está fuera de vigencia");
      }
    }
    if (error.response?.status === 404) {
      if (error.response.data.error === "No hay tienda") {
        throw new Error("No existe la tienda");
      }
      if (error.response.data.error === "No hay promocion") {
        throw new Error("No existe la promoción");
      }
    }
    throw error;
  }
};

// ---- MM ----

// GET /movimiento/pagos/
export const GetPagos = async () => {
  return [
    { destinatario_nombre: "Tienda A", monto: 100, producto_nombre: "Producto 1", fecha: "2024-09-27", codigo: "PROMO123" },
    { destinatario_nombre: "Tienda B", monto: 200, producto_nombre: "Producto 2", fecha: "2024-09-28", codigo: "PROMO456" },
  ];
  
  try {
    const response = await axios.get(`${URL_MM}/movimiento/pagos`);
    return response.data; // Devuelve List<{destinatario_nombre, monto, producto_nombre, fecha, codigo}>
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("No se encontraron pagos para el cliente");
    }
    throw error;
  }
};
