import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { bookApi } from './book'
import { BookItem } from './types';
import { RootState } from '../../store';

type BookState = {
    data: BookItem[]
}

const slice = createSlice({
    name: 'book',
    initialState: {
        data: [] as BookItem[]
    },
    reducers: {
        setProfile: (
            state, {
                payload: { }
            }: PayloadAction<BookState>
        ) => {
        },
        reset: (
            state, payload: PayloadAction
        ) => {
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            bookApi.endpoints.getLatestBooks.matchFulfilled,
            (state, { payload }) => {
                const _: BookItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            bookApi.endpoints.getTopRatedBooks.matchFulfilled,
            (state, { payload }) => {
                const _: BookItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            bookApi.endpoints.getBooksByCategory.matchFulfilled,
            (state, { payload }) => {
                const _: BookItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            bookApi.endpoints.getBooks.matchFulfilled,
            (state, { payload }) => {
                const _: BookItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        )
    },
})

export default slice.reducer
export const selectBooks = (state: RootState) => state.book.data