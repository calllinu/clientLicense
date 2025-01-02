import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Organization,
    OrganizationUpdateRequest,
    OrganizationAddRequest
} from "../interfaces/OrganizationInterfaces";

export const organizationApi = createApi({
    reducerPath: 'organizationApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/organizations' }), // The base URL for the organization endpoints
    endpoints: (builder) => ({
        addOrganization: builder.mutation<void, OrganizationAddRequest>({
            query: (organization) => ({
                url: '/add',
                method: 'POST',
                body: organization,
            }),
        }),
        removeOrganization: builder.mutation<{ message: string }, string>({
            query: (registerCode) => ({
                url: `/remove/${registerCode}`,
                method: 'DELETE',
            }),
        }),
        updateOrganization: builder.mutation<void, OrganizationUpdateRequest>({
            query: ({ updatedFields, registerCode }) => ({
                url: `/update/${registerCode}`,
                method: 'PUT',
                body: updatedFields,
            }),
        }),
        getOrganizationByRegisterCode: builder.query<void, string>({
            query: (registerCode) => ({
                url: `/get/${registerCode}`,
                method: 'GET',
            }),
        }),
        getAllOrganizations: builder.query<Organization[], void>({
            query: () => ({
                url: '/all',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useAddOrganizationMutation,
    useRemoveOrganizationMutation,
    useUpdateOrganizationMutation,
    useGetOrganizationByRegisterCodeQuery,
    useGetAllOrganizationsQuery
} = organizationApi;
