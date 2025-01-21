import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RegistrationRequest} from "../interfaces/RequestsApi.tsx";

export const registrationRequestsApi = createApi({
    reducerPath: 'registrationRequestsApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/registration-requests'}),
    endpoints: (builder) => ({
        getRequestsByAdmin: builder.query<RegistrationRequest[], number>({
            query: (adminId) => `/admin/${adminId}`,
        }),
        acceptRequest: builder.mutation<void, number>({
            query: (requestId) => ({
                url: `/accept/${requestId}`,
                method: 'PUT',
            }),
        }),
        declineRequest: builder.mutation<void, number>({
            query: (requestId) => ({
                url: `/decline/${requestId}`,
                method: 'PUT',
            }),
        }),
    }),
});

export const {
    useGetRequestsByAdminQuery,
    useAcceptRequestMutation,
    useDeclineRequestMutation
} = registrationRequestsApi;
