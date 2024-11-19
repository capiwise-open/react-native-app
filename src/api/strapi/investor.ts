import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../../app.config';
import { CarouselItem, InvestorItem } from './types';

// Define a service using a base URL and expected endpoints
export const investorApi = createApi({
    reducerPath: 'investorApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.DEV_STRAPI_API,
    }),
    tagTypes: ["INVESTOR", "CAROUSEL"],
    endpoints: (builder) => ({
        getInvestors: builder.query<InvestorItem[], Partial<{
            page?: number,
            pageSize?: number,
        }>>({
            query: ({ page = 1, pageSize = 10 }) => {
                return {
                    url: `experts-investors?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["INVESTOR"]
        }),
        getCarousels: builder.query<CarouselItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `experts-investor-carousels?populate=*`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["CAROUSEL"]
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetInvestorsQuery, useGetCarouselsQuery } = investorApi;