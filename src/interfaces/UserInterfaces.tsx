export interface User {
    username: string;
    email: string;
    fullName: string;
    password: string;
    subsidiaryId: number | null;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface UserResponse {
    username: string;
    email: string;
    fullName: string;
    role: string;
}

export interface LoginResponse {
    userId: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
    accessToken: string;
    refreshToken: string;
}

export interface LogoutRequest {
    accessToken?: string;
    refreshToken?: string;
}

export interface LogoutResponse {
    message: string;
    success: boolean;
}
