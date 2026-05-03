export interface Movements {
    id: string;                 
    date: string;              
    numReg: number;    
    description: string;
    type: string;               
    ingreso: number | null;    
    gasto: number | null;
    saldo: number | null;
    state: string;             
    ref_id: string | null;
    user_uuid: string;
    user_name: string | null;
    user_email: string | null;
    created_at: string;         
  }