import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './userApi.tsx';
import { organizationApi } from './organizationApi.tsx';

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [organizationApi.reducerPath]: organizationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware, organizationApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
