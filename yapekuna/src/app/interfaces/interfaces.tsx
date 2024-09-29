export interface RegisterForm{
    nombre: string,
    telefono: string,
}

export interface LoginForm{
    telefono: string,
}

export interface TransferForm{
    destinatario_telefono: string,
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

