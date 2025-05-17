import {configureStore} from '@reduxjs/toolkit';
import {userApi} from './userApi.tsx';
import {organizationApi} from './organizationApi.tsx';
import {subsidiaryApi} from "./subsidiaryApi.tsx";
import {employeeApi} from "./employeeApi.tsx";
import {registrationRequestsApi} from "./requestsApi.tsx";
import {feedbackApi} from "./feedbackApi.tsx";
import {predictionApi} from "./predictionApi.tsx";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [organizationApi.reducerPath]: organizationApi.reducer,
        [subsidiaryApi.reducerPath]: subsidiaryApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [registrationRequestsApi.reducerPath]: registrationRequestsApi.reducer,
        [feedbackApi.reducerPath]: feedbackApi.reducer,
        [predictionApi.reducerPath]: predictionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware,
            organizationApi.middleware,
            subsidiaryApi.middleware,
            employeeApi.middleware,
            registrationRequestsApi.middleware,
            feedbackApi.middleware,
            predictionApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
