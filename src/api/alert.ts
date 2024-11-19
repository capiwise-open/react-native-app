import config from "../../app.config";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AlertData, Stock, StockSummary } from './types';
import { generateClient } from "aws-amplify/data";
import { GraphQLError } from "graphql";
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { Schema } from "../../amplify/data/resource";
import { AnyIfEmpty } from "react-redux";
const client = generateClient<Schema>();

const env = "dev";

type Response = any; //Schema["Alert"]["type"]
type Alert = Schema["Alert"]["type"];

// Define a service using a base URL and expected endpoints
export const alertApi = createApi({
    reducerPath: 'alertApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config[env].API_URL,
    }),
    tagTypes: ['Alert'],
    endpoints: (builder) => ({
        getAlerts: builder.query<Response, Partial<{ status?: boolean }>>({
            async queryFn({ status = true }) {
                try {
                    const data = await client?.models?.Alert?.list({
                        // authMode: "userPool",
                        // authToken: 
                    }).then(async ({ data, extensions, nextToken, errors }) => {
                        if (!errors && !!data) {
                            return data.filter(d => (!d.isDeleted && d.status === status));
                        }
                        throw Error("No data");
                    })
                    return {
                        data
                    }
                } catch (err) {
                    return {
                        data: {
                            error: JSON.stringify(err)
                        }
                    }
                }
            },
            providesTags: ['Alert']
        }),
        createAlert: builder.mutation<Response, Partial<Schema["Alert"]["type"]>>({
            async queryFn(alertData) {
                try {
                    const data = await client?.models?.Alert?.create({
                        ...alertData,
                        identifier: alertData.identifier!,
                        user_id: alertData.user_id!,
                    })
                        .then(({ data, extensions, errors }) => {
                            if (!errors && !!data) {
                                return data;
                            }
                            throw Error("No data");
                        })
                    return {
                        data
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
            invalidatesTags: ['Alert']
        }),
        updateAlert: builder.mutation<Response, Partial<Schema["Alert"]["type"]>>({
            async queryFn(alertData) {
                try {
                    const data = await client?.models?.Alert?.update({
                        id: alertData.id!,
                        ...alertData
                    })
                        .then(({ data, extensions, errors }) => {
                            if (!errors && !!data) {
                                return data;
                            }
                            throw Error("No data");
                        })
                    return {
                        data
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
            invalidatesTags: ['Alert']
        }),
        cancelAlert: builder.mutation<Response, Partial<{ id: string }>>({
            async queryFn(alertData) {
                try {
                    const data = await client?.models?.Alert?.update({
                        id: alertData.id!,
                        status: false
                    })
                        .then(({ data, extensions, errors }) => {
                            if (!errors && !!data) {
                                return data;
                            }
                            throw Error("No data");
                        })
                    return {
                        data
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
            invalidatesTags: ['Alert']
        }),
        deleteAlert: builder.mutation<Response, Partial<{ id: string }>>({
            async queryFn({ id }) {
                try {
                    const data = await client?.models?.Alert?.update({
                        id: id!,
                        isDeleted: true
                    })
                        .then(({ data, extensions, errors }) => {
                            if (!errors && !!data) {
                                return data;
                            }
                            throw Error("No data");
                        })
                    return {
                        data: true
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
            invalidatesTags: ['Alert']
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useCreateAlertMutation, useUpdateAlertMutation, useCancelAlertMutation, useGetAlertsQuery, useDeleteAlertMutation } = alertApi;