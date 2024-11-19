import config from "../../app.config";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsData } from './types';

const env = "dev";

// Define a service using a base URL and expected endpoints
export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config[env].API_URL,
    }),
    endpoints: (builder) => ({
        getNewsByCategory: builder.query<NewsData[], Partial<{
            category: string,
            token: string
        }>>({
            query: ({ category, token = "" }) => ({
                url: `news?category=${category}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            // Pick out errors and prevent nested properties in a hook or selector
            transformErrorResponse: (response: { data: NewsData[], status: number }, meta, arg) => {
                console.log("getNewsByCategory Failed", response);
                return response.data
            },
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetNewsByCategoryQuery } = newsApi