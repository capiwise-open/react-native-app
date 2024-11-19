import config from "../../app.config";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Stock, Watchlist } from './types';

const env = "dev";

export const watchlistApi = createApi({
    reducerPath: 'watchlistApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config[env].API_URL,
    }),
    tagTypes: ['Watchlist'],
    endpoints: (builder) => ({
        getMyWatchList: builder.query<Watchlist[], Partial<{
            token: string,
            email: string
        }>>({
            query: (credential) => ({
                url: `stocks/watchlist?email=${credential.email}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer  ${credential.token}`
                }
            }),
            transformResponse: (response: { data: Watchlist[], message: string }, meta, arg) => {
                // console.log("getMyWatchList", response.data);
                return response.data
            },
            // Pick out errors and prevent nested properties in a hook or selector
            transformErrorResponse: (response: { data: Watchlist[], status: number }, meta, arg) => {
                return response.data
            },
            providesTags: ['Watchlist']
        }),
        getWatchListBySymbol: builder.query<Watchlist[], Partial<{
            token: string,
            email: string,
            symbol: string
        }>>({
            query: (data) => ({
                url: `stocks/watchlist?email=${data.email}&watchlist=${data.symbol}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            }),
            transformResponse: (response: { data: Watchlist[], message: string }, meta, arg) => {
                // console.log("getWatchListBySymbol");
                return response.data
            },
            // Pick out errors and prevent nested properties in a hook or selector
            transformErrorResponse: (response: { data: Watchlist[], status: number }, meta, arg) => {
                // console.log("getWatchListBySymbol Failed", response);
                return response.data
            },
            providesTags: ['Watchlist']
        }),
    }),
})

export const { useGetMyWatchListQuery, useGetWatchListBySymbolQuery } = watchlistApi;