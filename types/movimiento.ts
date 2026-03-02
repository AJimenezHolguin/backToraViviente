export interface Movimiento {
    id: string;                 
    numero_registro: number;    
    fecha: string;              
    descripcion: string;
    tipo: string;               
    ingreso: number | null;    
    gasto: number | null;
    saldo: number | null;
    estado: string;             
    referencia_id: string | null;
    usuario_uuid: string;
    usuario_nombre: string;
    usuario_correo: string;
    created_at: string;         
  }