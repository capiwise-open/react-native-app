import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../../app.config';
import { CarouselItem, AudiobookCategoryItem, AudiobookItem, BookCategoryItem } from './types';

// Define a service using a base URL and expected endpoints
export const audiobookApi = createApi({
    reducerPath: 'audiobookApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.DEV_STRAPI_API,
    }),
    tagTypes: ["AUDIOBOOK", "CAROUSEL", "CATEGORY"],
    endpoints: (builder) => ({
        getAudiobooks: builder.query<AudiobookItem[], Partial<{
            page?: number,
            pageSize?: number,
            type: "TopRated" | "Latest" | "Category",
        }>>({
            query: ({ page = 1, pageSize = 10, type }) => {
                return {
                    url: `audio-books?${type === "Latest" ? "sort[0]=publish_at:asc" : (type === "TopRated" ? "sort[0]=rating:desc" : "")}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["AUDIOBOOK"]
        }),
        getTopRatedAudiobooks: builder.query<AudiobookItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `audio-books?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=rating:desc&populate=*`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["AUDIOBOOK"]
        }),
        getLatestAudiobooks: builder.query<AudiobookItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `audio-books?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publish_at:asc&populate=*`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["AUDIOBOOK"]
        }),
        getAudiobooksByCategory: builder.query<AudiobookItem[], Partial<{
            page?: number,
            pageSize?: number,
            category_id?: number,
        }>>({
            query: ({ page = 1, pageSize = 10, category_id = 1 }) => {

                return {
                    url: `audio-books?filters[audio_book_category][$eq]=${category_id}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["AUDIOBOOK"]
        }),
        getCarousels: builder.query<CarouselItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `audio-book-carousels?populate=*`,
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
        getCategories: builder.query<AudiobookCategoryItem[], Partial<{
            page?: number,
            pageSize?: number,
        }>>({
            query: ({ page = 1, pageSize = 10 }) => {
                const _url = `audio-book-categories?populate=*`;
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
        searchAudiobooks: builder.query<AudiobookItem[], Partial<{
            page?: number,
            pageSize?: number,
            searchText: string,
        }>>({
            query: ({ page = 1, pageSize = 10, searchText }) => {
                const _url = `audio-books?filters[$or][0][title][$contains]=${searchText}&filters[$or][1][author][$contains]=${searchText}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;
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
            providesTags: ["AUDIOBOOK"]
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAudiobooksQuery, useGetLatestAudiobooksQuery, useGetTopRatedAudiobooksQuery, useGetCarouselsQuery, useGetCategoriesQuery, useGetAudiobooksByCategoryQuery, useSearchAudiobooksQuery } = audiobookApi;