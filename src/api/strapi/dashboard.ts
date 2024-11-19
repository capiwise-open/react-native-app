import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../../app.config';
import { BookItem, DashboardCarouselItem, BookCategoryItem } from './types';

// Define a service using a base URL and expected endpoints
export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.DEV_STRAPI_API,
    }),
    tagTypes: ["CAROUSEL"],
    endpoints: (builder) => ({
        getCarousels: builder.query<DashboardCarouselItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `dashboard-carousels?populate=*`,
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
export const { useGetCarouselsQuery } = dashboardApi;