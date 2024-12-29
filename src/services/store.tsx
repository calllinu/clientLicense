import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './userApi.tsx';
import { organizationApi } from './organizationApi.tsx';
import {subsidiaryApi} from "./subsidiaryApi.tsx";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [organizationApi.reducerPath]: organizationApi.reducer,
        [subsidiaryApi.reducerPath]: subsidiaryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware, organizationApi.middleware, subsidiaryApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
