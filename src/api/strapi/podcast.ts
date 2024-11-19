import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../../app.config';
import { CarouselItem, PodcastCategoryItem, PodcastItem } from './types';

// Define a service using a base URL and expected endpoints
export const podcastApi = createApi({
    reducerPath: 'podcastApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.DEV_STRAPI_API,
    }),
    tagTypes: ["PODCAST", "CAROUSEL", "CATEGORY"],
    endpoints: (builder) => ({
        getPodcasts: builder.query<PodcastItem[], Partial<{
            page?: number,
            pageSize?: number,
            type: "TopRated" | "Latest" | "Category",
        }>>({
            query: ({ page = 1, pageSize = 10, type }) => {
                return {
                    url: `podcasts?${type === "Latest" ? "sort[0]=publish_at:asc" : (type === "TopRated" ? "sort[0]=rating:desc" : "")}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["PODCAST"]
        }),
        getTopRatedPodcasts: builder.query<PodcastItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `podcasts?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=rating:desc&populate=*`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["PODCAST"]
        }),
        getLatestPodcasts: builder.query<PodcastItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `podcasts?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publish_at:asc&populate=*`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["PODCAST"]
        }),
        getPodcastsByCategory: builder.query<PodcastItem[], Partial<{
            page?: number,
            pageSize?: number,
            category_id?: number,
        }>>({
            query: ({ page = 1, pageSize = 10, category_id = 1 }) => {

                return {
                    url: `podcasts?filters[podcast_category][$eq]=${category_id}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["PODCAST"]
        }),
        getCarousels: builder.query<CarouselItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `podcast-carousels?populate=*`,
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
        getCategories: builder.query<PodcastCategoryItem[], Partial<{
            page?: number,
            pageSize?: number,
        }>>({
            query: ({ page = 1, pageSize = 10 }) => {
                const _url = `podcast-categories?populate=*`;
                console.log(_url);
                return {
                    url: _url,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["CATEGORY"]
        }),
        searchPodcasts: builder.query<PodcastItem[], Partial<{
            page?: number,
            pageSize?: number,
            searchText: string,
        }>>({
            query: ({ page = 1, pageSize = 10, searchText }) => {
                const _url = `podcasts?filters[$or][0][title][$contains]=${searchText}&filters[$or][1][author][$contains]=${searchText}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;
                return {
                    url: _url,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["CATEGORY"]
        })
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPodcastsQuery, useGetLatestPodcastsQuery, useGetTopRatedPodcastsQuery, useGetCarouselsQuery, useGetCategoriesQuery, useGetPodcastsByCategoryQuery, useSearchPodcastsQuery } = podcastApi;