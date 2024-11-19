import config from "../../app.config";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsData } from './types';

const env = "dev";
const { MARKETAUX_API, MARKETAUX_API_KEY } = config;

let d = new Date();
const t = d.toISOString();
d.setDate(d.getDate() - 1);
const yesterdayFormatted = d.toISOString().replace(/\.\d{3}Z$/, '');
const todayFormatted = t.replace(/\.\d{3}Z$/, '');

// Define a service using a base URL and expected endpoints
export const marketauxApi = createApi({
    reducerPath: 'marketauxApi',
    baseQuery: fetchBaseQuery({
        baseUrl: MARKETAUX_API,
    }),
    endpoints: (builder) => ({
        getTopNews: builder.query<NewsData[], Partial<{}>>({
            query: () => ({
                url: `news/all?category=top&filter_entities=true&api_token=${MARKETAUX_API_KEY}&language=en&published_after=${yesterdayFormatted}&published_before=${todayFormatted}&sort=entity_match_score,entity_sentiment_score`
            }),
            transformResponse: (response: any, meta, arg) => {
                return response.data;
            },
        }),
    }),
});

export const { useGetTopNewsQuery } = marketauxApi;