import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {FeedbackInterface, FeedbackPageableInterface} from "../interfaces/FeedbackInterfaces.tsx";


export const feedbackApi = createApi({
    reducerPath: 'feedbackApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:9090/feedback'}),
    endpoints: (builder) => ({
        addEmployeeFeedback: builder.mutation<void, { employeeId: number, feedback: FeedbackInterface }>({
            query: ({employeeId, feedback}) => ({
                url: `/add/${employeeId}`,
                method: 'POST',
                body: feedback,
            }),
        }),
        getAllFeedbacksPageable: builder.query<FeedbackPageableInterface, { page: number; size: number }>({
            query: ({page, size}) => ({
                url: '/pageable-all',
                params: {
                    page,
                    size
                },
            }),
        }),
        getFeedbacksForOrganization: builder.query<FeedbackInterface[], { organizationCode: string }>({
            query: ({organizationCode}) => ({
                url: `/get-organization-feedbacks/${organizationCode}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useAddEmployeeFeedbackMutation,
    useGetAllFeedbacksPageableQuery,
    useGetFeedbacksForOrganizationQuery,
} = feedbackApi;
