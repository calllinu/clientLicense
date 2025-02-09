import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {EmployeeResponse, UpdateEmployeeRequest} from "../interfaces/EmployeeInterfaces.tsx";

export const employeeApi = createApi({
    reducerPath: 'employeeApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/employees'}),
    endpoints: (builder) => ({
        getEmployeeByUserId: builder.query<EmployeeResponse, number>({
            query: (userId) => ({
                url: `/user`,
                method: 'GET',
                params: {userId},
            }),
        }),
        updateEmployee: builder.mutation<void, UpdateEmployeeRequest>({
            query: ({userId, employee}) => ({
                url: `/update/${userId}`,
                method: 'PUT',
                body: employee,
            }),
        }),
        checkNullFields: builder.query<boolean, number>({
            query: (userId: number) => ({
                url: `/null-fields/${userId}`,
                method: 'GET',
            }),
        }),
        deleteEmployee: builder.mutation<void, number>({
            query: (userId) => ({
                url: `/delete-user/${userId}`,
                method: 'DELETE',
            }),
        }),
        getEmployeeAtSubsidiary: builder.query<EmployeeResponse[], number>({
            query: (subsidiaryId) => ({
                url: `/subsidiary-employees/${subsidiaryId}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetEmployeeByUserIdQuery,
    useUpdateEmployeeMutation,
    useCheckNullFieldsQuery,
    useDeleteEmployeeMutation,
    useGetEmployeeAtSubsidiaryQuery,
} = employeeApi;
