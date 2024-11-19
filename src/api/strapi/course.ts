import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../../app.config';
import { CourseItem, CarouselItem, CourseCategoryItem } from './types';

// Define a service using a base URL and expected endpoints
export const courseApi = createApi({
    reducerPath: 'courseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.DEV_STRAPI_API,
    }),
    tagTypes: ["COURSE", "CAROUSEL", "CATEGORY"],
    endpoints: (builder) => ({
        getCourses: builder.query<CourseItem[], Partial<{
            page?: number,
            pageSize?: number,
            type: "TopRated" | "Latest" | "Category",
        }>>({
            query: ({ page = 1, pageSize = 10, type }) => {
                return {
                    url: `courses?${type === "Latest" ? "sort[0]=publish_at:asc" : (type === "TopRated" ? "sort[0]=rating:desc" : "")}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["COURSE"]
        }),
        getTopRatedCourses: builder.query<CourseItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `courses?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=rating:desc&populate=*`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["COURSE"]
        }),
        getLatestCourses: builder.query<CourseItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `courses?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publish_at:asc&populate=*`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                }
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["COURSE"]
        }),
        getCoursesByCategory: builder.query<CourseItem[], Partial<{
            page?: number,
            pageSize?: number,
            category_id?: number,
        }>>({
            query: ({ page = 1, pageSize = 10, category_id = 1 }) => {

                return {
                    url: `courses?filters[course_category][$eq]=${category_id}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${config.DEV_STRAPI_TOKEN}`
                    }
                }
            },
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
            providesTags: ["COURSE"]
        }),
        getCarousels: builder.query<CarouselItem[], Partial<{
            page?: number,
            pageSize?: number
        }>>({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `course-carousels?populate=*`,
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
        getCategories: builder.query<CourseCategoryItem[], Partial<{
            page?: number,
            pageSize?: number,
        }>>({
            query: ({ page = 1, pageSize = 10 }) => {
                const _url = `course-categories?populate=*`;
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
        searchCourses: builder.query<CourseItem[], Partial<{
            page?: number,
            pageSize?: number,
            searchText: string,
        }>>({
            query: ({ page = 1, pageSize = 10, searchText }) => {
                const _url = `courses?filters[$or][0][title][$contains]=${searchText}&filters[$or][1][author][$contains]=${searchText}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;
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
            providesTags: ["COURSE"]
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCoursesQuery, useGetLatestCoursesQuery, useGetTopRatedCoursesQuery, useGetCarouselsQuery, useGetCategoriesQuery, useGetCoursesByCategoryQuery, useSearchCoursesQuery } = courseApi;