import config from "../../app.config";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ExchangeRate, NewsData, SymbolChange } from './types';

const env = "dev";
const { TWELVE_API, TWELVE_API_KEY } = config;

export const twelveApi = createApi({
    reducerPath: 'twelveApi',
    baseQuery: fetchBaseQuery({
        baseUrl: TWELVE_API,
        headers: {
            Authorization: `apikey ${config.TWELVE_API_KEY}`
        }
    }),
    endpoints: (builder) => ({
        getExchanges: builder.query<SymbolChange[], Partial<{
            symbols: string[],
            outputsize: number,
            interval: string
        }>>({
            query: ({ symbols, outputsize = 1, interval = "1day" }) => ({
                url: `time_series?symbol=${symbols.join(',')}&interval=${interval}&outputsize=${outputsize}`,
            }),
            transformResponse: (response: any, meta, arg) => {
                const keys = Object.keys(response);
                const changes: SymbolChange[] = [];
                for (const key of keys) {
                    changes.push({ ...response[key], values: response[key].values.reverse() });
                }
                return changes;
            },
        }),
        getExchangeRate: builder.query<ExchangeRate, Partial<string>>({
            query: (symbol) => ({
                url: `exchange_rate?symbol=${symbol}&apikey=${TWELVE_API_KEY}`,
                method: 'GET',
            }),
            transformResponse: (response: ExchangeRate, meta, arg) => {
                return response
            },
            // Pick out errors and prevent nested properties in a hook or selector
            transformErrorResponse: (response: any, meta, arg) => {
                return response
            },
        }),
        getCurrencyConversion: builder.query<{
            symbol: String,
            rate: Number,
            amount: number
        }, Partial<{ symbol: String, amount: number }>>({
            query: (data) => ({
                url: `currency_conversion?symbol=${data.symbol}&amount=${data.amount}`
            })
        })
    }),
});

export const { useGetExchangesQuery, useGetExchangeRateQuery, useGetCurrencyConversionQuery } = twelveApi;