
import config from "../../app.config";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { generateClient } from "aws-amplify/data";
import { GraphQLError } from "graphql";
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { Schema } from "../../amplify/data/resource";
import { AnyIfEmpty } from "react-redux";
const client = generateClient<Schema>();

type Response = any;// Schema["Profile"]["type"] // UserProfile

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config["dev"].API_URL,
    }),
    tagTypes: ['Profile'],
    endpoints: (builder) => ({
        getProfile: builder.query<Response, Partial<any>>({
            async queryFn(arg, api, extraOptions, baseQuery) {
                try {
                    const data = await client?.models?.Profile?.list({
                        // authMode: "userPool",
                        // authToken: 
                    }).then(async ({ data, extensions, nextToken, errors }) => {
                        if (!!data && data.length > 0) {
                            return data[0];
                        }
                        throw Error("No data");
                    })
                    return {
                        data
                    }
                } catch (err) {
                    return {
                        data: null
                        // error: {
                        //     status: 'CUSTOM_ERROR',
                        //     error: JSON.stringify(err)
                        // }
                    }
                }
            },
            providesTags: ['Profile']
        }),
        updateProfile: builder.mutation<Response, Partial<{ newProfile: Schema["Profile"]["type"] }>>({
            async queryFn(arg) {
                try {
                    const res = await client?.models?.Profile?.update({
                        ...arg?.newProfile!,
                    })
                    if (!!res.errors)
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                error: JSON.stringify(res.errors)
                            }
                        }
                    return {
                        data: res.data
                    }
                } catch (err) {
                    return {
                        error: {
                            status: 'CUSTOM_ERROR',
                            error: JSON.stringify(err)
                        }
                    }
                }
            },
            invalidatesTags: ['Profile']
        }),
        updateWatchlist: builder.mutation<Response, Partial<{ id: string, watchlist: string[] }>>({
            async queryFn(arg) {
                try {
                    const res = await client?.models?.Profile?.update({
                        id: arg.id!,
                        watchlist: arg.watchlist
                    })
                    if (!!res.errors)
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                error: JSON.stringify(res.errors)
                            }
                        }
                    return {
                        data: res.data
                    }
                } catch (err) {
                    return {
                        error: {
                            status: 'CUSTOM_ERROR',
                            error: JSON.stringify(err)
                        }
                    }
                }
            },
            invalidatesTags: ['Profile']
        }),
        updateSetting: builder.mutation<Response, Partial<{ id: string, settings: string }>>({
            async queryFn(arg) {
                try {
                    const res = await client?.models?.Profile?.update({
                        id: arg.id!,
                        settings: arg.settings
                    })
                    console.log(res);
                    if (!!res.errors)
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                error: JSON.stringify(res.errors)
                            }
                        }
                    return {
                        data: res.data
                    }
                } catch (err) {
                    return {
                        error: {
                            status: 'CUSTOM_ERROR',
                            error: JSON.stringify(err)
                        }
                    }
                }
            },
            invalidatesTags: ['Profile']
        }),
        registerNotificationToken: builder.mutation<Response, Partial<{ id: string, ntoken: string }>>({
            queryFn: async ({ id, ntoken }) => {
                try {
                    const res = await client?.models?.Profile?.update({
                        id: id!,
                        ntoken
                    })
                    if (!!res.errors)
                        return {
                            data: {
                                error: JSON.stringify(res.errors)
                            }
                        }
                    return {
                        data: res.data
                    }
                } catch (err) {
                    return {
                        data: {
                            error: JSON.stringify(err)
                        }
                    }
                }
            },
            invalidatesTags: ['Profile']
        })
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProfileQuery, useUpdateProfileMutation, useUpdateSettingMutation, useRegisterNotificationTokenMutation, useUpdateWatchlistMutation } = userApi