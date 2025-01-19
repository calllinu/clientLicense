import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    OrganizationUpdateRequest,
    OrganizationAddRequest, OrganizationResponse
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
            query: (organizationId) => ({
                url: `/remove/${organizationId}`,
                method: 'DELETE',
            }),
        }),
        updateOrganization: builder.mutation<void, OrganizationUpdateRequest>({
            query: ({ organizationId, name, yearOfEstablishment }) => ({
                url: `/update/${organizationId}`,
                method: 'PUT',
                body: { name, yearOfEstablishment },
            }),
        }),

        getOrganizationByRegisterCode: builder.query<void, string>({
            query: (registerCode) => ({
                url: `/get/${registerCode}`,
                method: 'GET',
            }),
        }),
        getAllOrganizations: builder.query<OrganizationResponse[], void>({
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
