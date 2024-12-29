import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    SubsidiaryResponse,
    SubsidiaryRequest,
    SubsidiaryUpdateRequest,
    Subsidiary
} from "../interfaces/SubsidiaryInterfaces";

export const subsidiaryApi = createApi({
    reducerPath: 'subsidiaryApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/subsidiaries' }), // The base URL for the subsidiary endpoints
    endpoints: (builder) => ({
        addSubsidiary: builder.mutation<SubsidiaryResponse, SubsidiaryRequest>({
            query: (subsidiary) => ({
                url: '/add',
                method: 'POST',
                body: subsidiary,
            }),
        }),
        removeSubsidiary: builder.mutation<{ message: string }, string>({
            query: (subsidiaryId) => ({
                url: `/remove/${subsidiaryId}`,
                method: 'DELETE',
            }),
        }),
        updateSubsidiary: builder.mutation<SubsidiaryResponse, SubsidiaryUpdateRequest>({
            query: ({ updatedFields, subsidiaryId }) => ({
                url: `/update/${subsidiaryId}`,
                method: 'PUT',
                body: updatedFields,
            }),
        }),
        getSubsidiaryById: builder.query<SubsidiaryResponse, string>({
            query: (subsidiaryId) => ({
                url: `/get/${subsidiaryId}`,
                method: 'GET',
            }),
        }),
        getAllSubsidiaries: builder.query<Subsidiary[], void>({
            query: () => ({
                url: '/all',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useAddSubsidiaryMutation,
    useRemoveSubsidiaryMutation,
    useUpdateSubsidiaryMutation,
    useGetSubsidiaryByIdQuery,
    useGetAllSubsidiariesQuery
} = subsidiaryApi;
