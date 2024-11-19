import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PodcastItem } from './types';
import { RootState } from '../../store';
import { podcastApi } from './podcast';

type PodcastState = {
    data: PodcastItem[]
}

const slice = createSlice({
    name: 'podcast',
    initialState: {
        data: [] as PodcastItem[]
    },
    reducers: {
        setProfile: (
            state, {
                payload: { }
            }: PayloadAction<PodcastState>
        ) => {
        },
        reset: (
            state, payload: PayloadAction
        ) => {
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            podcastApi.endpoints.getLatestPodcasts.matchFulfilled,
            (state, { payload }) => {
                const _: PodcastItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            podcastApi.endpoints.getTopRatedPodcasts.matchFulfilled,
            (state, { payload }) => {
                const _: PodcastItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            podcastApi.endpoints.getPodcastsByCategory.matchFulfilled,
            (state, { payload }) => {
                const _: PodcastItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            podcastApi.endpoints.getPodcasts.matchFulfilled,
            (state, { payload }) => {
                const _: PodcastItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        )
    },
})

export default slice.reducer
export const selectPodcasts = (state: RootState) => state.podcast.data