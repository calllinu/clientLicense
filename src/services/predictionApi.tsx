import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

interface PredictionRequest {
    features: (number | string | undefined)[][];
}

interface PredictionResponse {
    risk_score: number;
    predictions: number[];
}

export const predictionApi = createApi({
    reducerPath: 'predictionApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:9090/prediction-data'}),
    endpoints: (builder) => ({
        predictWorkAccident: builder.mutation<PredictionResponse, PredictionRequest>({
            query: (body) => ({
                url: '/predict',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {usePredictWorkAccidentMutation} = predictionApi;
