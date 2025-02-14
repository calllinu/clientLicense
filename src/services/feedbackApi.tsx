import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {FeedbackInterface} from "../interfaces/FeedbackInterfaces.tsx";


export const feedbackApi = createApi({
    reducerPath: 'feedbackApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/feedback'}),
    endpoints: (builder) => ({
        addEmployeeFeedback: builder.mutation<void, { employeeId: number, feedback: FeedbackInterface }>({
            query: ({employeeId, feedback}) => ({
                url: `/add/${employeeId}`,
                method: 'POST',
                body: feedback,
            }),
        }),
    }),
});

export const {
    useAddEmployeeFeedbackMutation,
} = feedbackApi;
