import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserAttribute, UserProfile } from './types'
import { RootState } from '../store'
import { userApi } from './profile'

type AuthState = {
    attributes?: UserAttribute
    token?: string,
    profile?: UserProfile
}

const slice = createSlice({
    name: 'auth',
    initialState: {} as AuthState,
    reducers: {
        setCredentials: (
            state,
            {
                payload: { attributes, token },
            }: PayloadAction<AuthState>,
        ) => {
            state.attributes = attributes;
            state.token = token;
        },
        setProfile: (
            state, {
                payload: { profile }
            }: PayloadAction<{ profile: UserProfile }>
        ) => {
            state.profile = profile;
        },
        reset: (
            state, payload: PayloadAction
        ) => {
            state.attributes = undefined;
            state.token = undefined;
            state.profile = undefined;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            userApi.endpoints.updateProfile.matchFulfilled,
            (state, { payload }) => {
                state.profile = payload
            },
        )
    },
})

export const { setCredentials, reset } = slice.actions
export default slice.reducer
export const selectCurrentUserAttribute = (state: RootState) => state.auth.attributes
