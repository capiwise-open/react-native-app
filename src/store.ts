import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux'

import { stockApi } from './api/stock';
import { watchlistApi } from './api/watchlist';
import { newsApi } from './api/news';
import { alertApi } from './api/alert';
import { userApi } from './api/profile';
import { marketauxApi } from './api/marketaux';
import { twelveApi } from './api/twelvedata';
import { coinApi } from './api/coinapi';

import authReducer from './api/authSlice';
import bookReducer from './api/strapi/bookSlice';
import audiobookReducer from './api/strapi/audiobookSlice'
import podcastReducer from './api/strapi/podcastSlice';
import courseReducer from './api/strapi/courseSlice';
import currencyReduce from './api/currencySlice';
import { notificationApi } from './api/notifications';
import { bookApi } from './api/strapi/book';
import { audiobookApi } from './api/strapi/audiobook';
import { podcastApi } from './api/strapi/podcast';
import { investorApi } from './api/strapi/investor';
import { courseApi } from './api/strapi/course';
import { dashboardApi } from './api/strapi/dashboard';

// export const store = configureStore({
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(pokemonApi.middleware),
// })

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization

export const store = configureStore({
    reducer: {
        [stockApi.reducerPath]: stockApi.reducer,
        [watchlistApi.reducerPath]: watchlistApi.reducer,
        [newsApi.reducerPath]: newsApi.reducer,
        [marketauxApi.reducerPath]: marketauxApi.reducer,
        [alertApi.reducerPath]: alertApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [twelveApi.reducerPath]: twelveApi.reducer,
        [coinApi.reducerPath]: coinApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [bookApi.reducerPath]: bookApi.reducer,
        [audiobookApi.reducerPath]: audiobookApi.reducer,
        [podcastApi.reducerPath]: podcastApi.reducer,
        [investorApi.reducerPath]: investorApi.reducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        book: bookReducer,
        audiobook: audiobookReducer,
        podcast: podcastReducer,
        course: courseReducer,
        auth: authReducer,
        currency: currencyReduce
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            stockApi.middleware,
            watchlistApi.middleware,
            newsApi.middleware,
            marketauxApi.middleware,
            alertApi.middleware,
            userApi.middleware,
            twelveApi.middleware,
            coinApi.middleware,
            notificationApi.middleware,
            bookApi.middleware,
            audiobookApi.middleware,
            podcastApi.middleware,
            investorApi.middleware,
            courseApi.middleware,
            dashboardApi.middleware
        ])
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
setupListeners(store.dispatch)