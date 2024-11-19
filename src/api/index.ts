import { useGetAlertsQuery, useCreateAlertMutation, useUpdateAlertMutation } from "./alert";
import { useGetNewsByCategoryQuery } from './news';
import { useGetTrendingMarketExchangeListQuery, useGetStockSummaryQuery } from './stock';
import { useGetMyWatchListQuery, useGetWatchListBySymbolQuery } from './watchlist';
import { useGetProfileQuery, useUpdateProfileMutation, useUpdateWatchlistMutation, useRegisterNotificationTokenMutation } from './profile';

export {
    // users_profile
    useGetProfileQuery,
    useUpdateProfileMutation,
    useUpdateWatchlistMutation,
    useRegisterNotificationTokenMutation,

    useGetAlertsQuery,
    useCreateAlertMutation,
    useUpdateAlertMutation,

    useGetNewsByCategoryQuery,

    useGetTrendingMarketExchangeListQuery,
    useGetStockSummaryQuery,

    useGetMyWatchListQuery,
    useGetWatchListBySymbolQuery,
}