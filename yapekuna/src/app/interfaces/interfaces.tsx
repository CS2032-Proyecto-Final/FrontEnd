export interface RegisterForm{
    nombre: string,
    telefono: string,
}

export interface LoginForm{
    telefono: string,
}

export interface TransferForm{
    destinatario_numero: string,
    monto: number, 
    descripcion: string,
}

export interface PagoForm{
    persona_id: number,
}

export interface Id {
    id: number,
}

export interface Pago {
    destinatario_nombre: string;
    monto: number;
    producto_nombre: string;
    fecha: string;
    codigo: string;
}

export interface Promocion {
    id: string,
    nombre_tienda: string,
    nombre_producto: string,
    descuento: number,
    precio: number,
    descripcion: string,
    dia_inicio: string,
    dia_final: string,
}