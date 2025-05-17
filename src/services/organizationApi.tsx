import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
    Organization,
    OrganizationAddRequest,
    OrganizationResponse,
    OrganizationUpdateRequest
} from "../interfaces/OrganizationInterfaces";
import {SubsidiaryForOrganizationObject} from "../interfaces/SubsidiaryForOrganizationObject.tsx";

export const organizationApi = createApi({
    reducerPath: 'organizationApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:9090/organizations'}),
    endpoints: (builder) => ({
        addOrganization: builder.mutation<void, OrganizationAddRequest>({
            query: (organization) => ({
                url: '/add',
                method: 'POST',
                body: organization,
            }),
        }),
        removeOrganization: builder.mutation<void, number>({
            query: (organizationId) => ({
                url: `/remove/${organizationId}`,
                method: 'DELETE',
            }),
        }),
        updateOrganization: builder.mutation<void, OrganizationUpdateRequest>({
            query: ({organizationId, name, yearOfEstablishment}) => ({
                url: `/update/${organizationId}`,
                method: 'PUT',
                body: {name, yearOfEstablishment},
            }),
        }),
        getAllOrganizationsPageable: builder.query<{
            data: OrganizationResponse[];
            total: number;
        }, { page: number; size: number; search: string }>({
            query: ({page, size, search}) => ({
                url: '/pageable-all',
                params: {
                    page,
                    size,
                    search,
                },
            }),
        }),
        getAllOrganizations: builder.query<Organization[], void>({
            query: () => ({
                url: '/all',
                method: 'GET',
            }),
        }),
        getSubsidiariesForOrganization: builder.query<SubsidiaryForOrganizationObject, number>({
            query: (userId) => ({
                url: `/subsidiaries/${userId}`,
                method: 'GET',
            }),
        }),
        getAllOrganizationsCode: builder.query<string[], void>({
            query: () => ({
                url: '/get-all-organization-names',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useAddOrganizationMutation,
    useRemoveOrganizationMutation,
    useUpdateOrganizationMutation,
    useGetAllOrganizationsPageableQuery,
    useGetAllOrganizationsQuery,
    useGetSubsidiariesForOrganizationQuery,
    useGetAllOrganizationsCodeQuery,
} = organizationApi;
