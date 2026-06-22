export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Report {
    id: number;
    user_id: number;
    title: string;
    description: string;
    image: string | null;
    status: 'menunggu' | 'diproses' | 'selesai';
    created_at: string;
    updated_at: string;
    user?: User;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
