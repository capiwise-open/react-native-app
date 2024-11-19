import config from "../../app.config";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Response = any

type NotificationItem = {
    pushToken: string,
    user_id: string,
    title: string,
    subTitle: string,
    data: {
        action: "stock-change" & string,
        type: "ALERT" | "NEWS",
        etf: boolean,
        alert_id: string,
        symbol: string,
    }
}

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config["dev"].API_URL,
    }),
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotification: builder.query<Response, Partial<{ email: string }>>({
            query: (credential) => ({
                url: `notification?email=${credential.email}`,
                method: 'GET',
            }),
            providesTags: ['Notification']
        }),
        updateNotification: builder.mutation<Response, Partial<{ id: string }>>({
            query: ({ id = "" }) => ({
                url: `notification`,
                method: 'POST',
                body: JSON.stringify({ id: id })
            }),
            invalidatesTags: ['Notification']
        }),
        addNotification: builder.mutation<Response, Partial<{ user_id?: String, data: any }>>({
            query: ({ user_id = "", data }) => ({
                url: `notification`,
                method: 'PUT',
                body: JSON.stringify({ user_id: user_id, notification: data })
            }),
            invalidatesTags: ['Notification']
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetNotificationQuery, useUpdateNotificationMutation, useAddNotificationMutation } = notificationApi