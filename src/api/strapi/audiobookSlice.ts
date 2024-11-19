import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store';
import { audiobookApi } from './audiobook';
import { AudiobookItem } from './types';

type AudiobookState = {
    data: AudiobookItem[]
}

const slice = createSlice({
    name: 'audiobook',
    initialState: {
        data: [] as AudiobookItem[]
    },
    reducers: {
        setProfile: (
            state, {
                payload: { }
            }: PayloadAction<AudiobookState>
        ) => {
        },
        reset: (
            state, payload: PayloadAction
        ) => {
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            audiobookApi.endpoints.getLatestAudiobooks.matchFulfilled,
            (state, { payload }) => {
                const _: AudiobookItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            audiobookApi.endpoints.getTopRatedAudiobooks.matchFulfilled,
            (state, { payload }) => {
                const _: AudiobookItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            audiobookApi.endpoints.getAudiobooksByCategory.matchFulfilled,
            (state, { payload }) => {
                const _: AudiobookItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            audiobookApi.endpoints.getAudiobooks.matchFulfilled,
            (state, { payload }) => {
                const _: AudiobookItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        )
    },
})

export default slice.reducer
export const selectAudiobooks = (state: RootState) => state.book.data