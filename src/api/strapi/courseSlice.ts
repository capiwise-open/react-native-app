import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { courseApi } from './course'
import { CourseItem } from './types';
import { RootState } from '../../store';

type CourseState = {
    data: CourseItem[]
}

const slice = createSlice({
    name: 'course',
    initialState: {
        data: [] as CourseItem[]
    },
    reducers: {
        setProfile: (
            state, {
                payload: { }
            }: PayloadAction<CourseState>
        ) => {
        },
        reset: (
            state, payload: PayloadAction
        ) => {
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            courseApi.endpoints.getLatestCourses.matchFulfilled,
            (state, { payload }) => {
                const _: CourseItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            courseApi.endpoints.getTopRatedCourses.matchFulfilled,
            (state, { payload }) => {
                const _: CourseItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            courseApi.endpoints.getCoursesByCategory.matchFulfilled,
            (state, { payload }) => {
                const _: CourseItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        ).addMatcher(
            courseApi.endpoints.getCourses.matchFulfilled,
            (state, { payload }) => {
                const _: CourseItem[] = [...state.data]
                for (let p of payload) {
                    _.findIndex((v) => v.id === p.id) < 0 && _.push(p)
                }
                state.data = _;
            },
        )
    },
})

export default slice.reducer
export const selectCourses = (state: RootState) => state.course.data