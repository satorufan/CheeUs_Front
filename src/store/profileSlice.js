import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profiles from '../profileData'; // 경로 수정

const initialState = {
    userLocation: null,
    likedProfiles: [],
    userProfile: null,
    status: 'idle',
    error: null,
};

// 사용자 프로필을 비동기적으로 가져오는 thunk
export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async (userId) => {
        const userProfile = profiles.find(profile => profile.id === userId);
        if (!userProfile) {
            throw new Error('Profile not found');
        }
        return userProfile;
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateUserLocation(state, action) {
            state.userLocation = action.payload;
        },
        likeProfile(state, action) {
            const profileId = action.payload;
            if (!state.likedProfiles.includes(profileId)) {
                state.likedProfiles.push(profileId);
            }
        },
        unlikeProfile(state, action) {
            const profileId = action.payload;
            state.likedProfiles = state.likedProfiles.filter(id => id !== profileId);
        },
        setLikedProfiles(state, action) {
            state.likedProfiles = action.payload;
        },
        updateUserProfile(state, action) {
            state.userProfile = { ...state.userProfile, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userProfile = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.userProfile = null;
            });
    },
});

export const {
    updateUserLocation,
    likeProfile,
    unlikeProfile,
    setLikedProfiles,
    updateUserProfile,
} = profileSlice.actions;

export const selectUserProfile = (state) => state.profile.userProfile;
export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;