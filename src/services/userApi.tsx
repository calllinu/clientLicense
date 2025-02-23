import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {LoginResponse, LoginUser, LogoutRequest, LogoutResponse, User} from "../interfaces/UserInterfaces.tsx";
import {OTPRequest, OTPVerification, PasswordReset} from "../interfaces/authOTP.tsx";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080'}),
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
        sendOtp: builder.mutation<void, OTPRequest>({
            query: (request) => ({
                url: '/send-otp',
                method: 'POST',
                body: request,
            }),
        }),
        verifyOtp: builder.mutation<void, OTPVerification>({
            query: (request) => ({
                url: '/verify-otp',
                method: 'POST',
                body: request,
            }),
        }),
        changePassword: builder.mutation<void, PasswordReset>({
            query: (request) => ({
                url: '/change-password',
                method: 'POST',
                body: request,
            }),
        }),
    }),
});

export const {
    useCreateUserMutation,
    useAuthenticateUserMutation,
    useLogoutUserMutation,
    useSendOtpMutation,
    useChangePasswordMutation,
    useVerifyOtpMutation
} = userApi;
