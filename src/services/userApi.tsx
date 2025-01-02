import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    LoginResponse,
    LoginUser,
    LogoutRequest,
    LogoutResponse,
    User
} from "../interfaces/UserInterfaces.tsx";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    endpoints: (builder) => ({
        createUser: builder.mutation<void, User>({
            query: (user) => ({
                url: '/register',
                method: 'POST',
                body: user,
            }),
        }),
        authenticateUser: builder.mutation<LoginResponse, LoginUser>({
            query: (user) => ({
                url: '/login',
                method: 'POST',
                body: user,
            }),
        }),
        logoutUser: builder.mutation<LogoutResponse, LogoutRequest>({
            query: (request) => ({
                url: '/log-out',
                method: 'POST',
                body: request,
            }),
        }),
    }),
});

export const { useCreateUserMutation, useAuthenticateUserMutation , useLogoutUserMutation} = userApi;
