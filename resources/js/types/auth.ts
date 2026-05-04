export type User = {
    id: number;

    nombre: string;
    apellido: string;

    email: string;
    password?: string;

    telefono: string;
    carnet_identidad: string;
    direccion?: string;

    rol: 'admin' | 'encargado' | 'remitente';
    estado: boolean;

    email_verified_at: string | null;
    remember_token?: string;

    created_at: string;
    updated_at: string;

    avatar?: string;

    [key: string]: unknown;
};
export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
