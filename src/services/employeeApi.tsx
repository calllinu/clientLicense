import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {EmployeeResponse, UpdateEmployeeRequest} from "../interfaces/EmployeeInterfaces.tsx";

export const employeeApi = createApi({
    reducerPath: 'employeeApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/employees' }),
    endpoints: (builder) => ({
        getEmployeeByUserId: builder.query<EmployeeResponse, number>({
            query: (userId) => ({
                url: `/user`,
                method: 'GET',
                params: { userId },
            }),
        }),
        updateEmployee: builder.mutation<void, UpdateEmployeeRequest>({
            query: ({ userId, employee }) => ({
                url: `/update/${userId}`,
                method: 'PUT',
                body: employee,
            }),
        }),
    }),
});

export const { useGetEmployeeByUserIdQuery,
               useUpdateEmployeeMutation
        } = employeeApi;
