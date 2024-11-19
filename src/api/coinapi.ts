import config from "../../app.config";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Asset, ExchangeRate, NewsData, SymbolChange } from './types';

export const coinApi = createApi({
    reducerPath: 'coinApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.COIN_API,
        headers: {
            "X-CoinAPI-Key": config.COIN_API_KEY,
            "Accept": "text/plain"
        }
    }),
    endpoints: (builder) => ({
        getAssetsLogo: builder.query<Asset[], Partial<{
            size: number
        }>>({
            query: ({ size = 256 }) => ({
                url: `assets/icons/${size}`,
            }),
        }),
    }),
});

export const { useGetAssetsLogoQuery } = coinApi;