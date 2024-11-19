import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../../app.config';
import { BookItem, CarouselItem, BookCategoryItem } from './types';

// Define a service using a base URL and expected endpoints
export const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.DEV_STRAPI_API,
    }),
    tagTypes: ["BOOK", "CAROUSEL", "CATEGORY"],
    endpoints: (builder) => ({
        getBooks: builder.query<BookItem[], Partial<{
            page?: number,
            pageSize?: number,
            type: "TopRated" | "Latest" | "Category",
        }>>({
            query: ({ page = 1, pageSize = 10, type }) => {
                return {
                    url: `books?${type === "Latest" ? "sort[0]=publish_at:asc" : (type === "TopRated" ? "sort[0]=rating:desc" : "")}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["BOOK"]
        }),
        getTopRatedBooks: builder.query<BookItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `books?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=rating:desc&populate=*`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["BOOK"]
        }),
        getLatestBooks: builder.query<BookItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `books?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publish_at:asc&populate=*`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["BOOK"]
        }),
        getBooksByCategory: builder.query<BookItem[], Partial<{
            page?: number,
            pageSize?: number,
            category_id?: number,
        }>>({
            query: ({ page = 1, pageSize = 10, category_id = 1 }) => {

                return {
                    url: `books?filters[book_category][$eq]=${category_id}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["BOOK"]
        }),
        getCarousels: builder.query<CarouselItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `book-carousels?populate=*`,
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
        getCategories: builder.query<BookCategoryItem[], Partial<{
            page?: number,
            pageSize?: number,
        }>>({
            query: ({ page = 1, pageSize = 10 }) => {
                const _url = `book-categories?populate=*`;
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
        searchBooks: builder.query<BookItem[], Partial<{
            page?: number,
            pageSize?: number,
            searchText: string,
        }>>({
            query: ({ page = 1, pageSize = 10, searchText }) => {
                const _url = `books?filters[$or][0][title][$contains]=${searchText}&filters[$or][1][author][$contains]=${searchText}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;
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
            providesTags: ["BOOK"]
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetBooksQuery, useGetLatestBooksQuery, useGetTopRatedBooksQuery, useGetCarouselsQuery, useGetCategoriesQuery, useGetBooksByCategoryQuery, useSearchBooksQuery } = bookApi;