import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {SubsidiaryRequest, SubsidiaryResponse, SubsidiaryUpdateRequest} from "../interfaces/SubsidiaryInterfaces";

export const subsidiaryApi = createApi({
    reducerPath: 'subsidiaryApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:9090/subsidiaries'}),
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
        updateSubsidiary: builder.mutation<void, { values: SubsidiaryUpdateRequest; subsidiaryId: number }>({
            query: ({values, subsidiaryId}) => ({
                url: `/update/${subsidiaryId}`,
                method: 'PUT',
                body: {
                    country: values.country,
                    city: values.city,
                    address: values.address,
                }
            }),
        }),
    }),
});

export const {
    useAddSubsidiaryMutation,
    useRemoveSubsidiaryMutation,
    useUpdateSubsidiaryMutation,
} = subsidiaryApi;



