import config from "../../app.config";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EtfStockSummary, Stock, StockSummary } from './types';

const env = "dev";

export const stockApi = createApi({
    reducerPath: 'stockApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config[env].API_URL,
    }),
    endpoints: (builder) => ({
        getTrendingMarketExchangeList: builder.query<Stock[], Partial<{
            token: string,
            email: string
        }>>({
            query: (credential) => ({
                url: `stocks/trending-market-exchangelist?email=${credential.email}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${credential.token}`
                }
            }),
            transformResponse: (response: { data: Stock[], exchanges: string[] }, meta, arg) => {
                return response.data
            },
            // Pick out errors and prevent nested properties in a hook or selector
            transformErrorResponse: (response: { data: Stock[], status: number }, meta, arg) => {
                console.log("getTrendingMarketExchangeList Failed", response);
                return response
            },
        }),
        getStockSummary: builder.query<StockSummary, Partial<{
            symbol: String,
            token: String,
            email: String
        }>>({
            query: (data) => ({
                url: `stocks/summary?ticker=${data.symbol}&email=${data.email}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            })
        }),
        getEtfStockSummary: builder.query<EtfStockSummary, Partial<{
            symbol: string,
            token?: string,
            email?: string
        }>>({
            query: (data) => ({
                url: `stocks/etf-stocks?ticker=${data.symbol}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            }),
            // Pick out errors and prevent nested properties in a hook or selector
            transformErrorResponse: (response: { data: Stock[], status: number }, meta, arg) => {
                console.log("getEtfStockSummary Failed", response);
                return response
            },
        }),
        getTopEarningStocks: builder.query<{
            symbol: string,
            name: string,
            exchange: string,
            mic_code: string,
            currency: string,
            datetime: string,
            timestamp: number,
            open: number,
            high: number,
            low: number,
            close: number,
            volume: number,
            previous_close: number,
            change: number,
            percent_change: number,
            average_volume: number,
            is_market_open: false,
            fifty_two_week: {
                low: number,
                high: number,
                low_change: number,
                high_change: number,
                low_change_percent: number,
                high_change_percent: number,
                range: string
            },
            logo: string,
            instrument_type: string,
            isWatchlisted: false
        }, Partial<{
            category: string,
            token?: string,
            email?: string
        }>>({
            query: (data) => ({
                url: `stocks/top-earning?category=${data.category}&email=${data.email}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            })
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetTrendingMarketExchangeListQuery,
    useGetStockSummaryQuery,
    useGetEtfStockSummaryQuery,
    useGetTopEarningStocksQuery
} = stockApi