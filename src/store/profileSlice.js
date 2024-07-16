import { createSlice } from '@reduxjs/toolkit';
import profiles from '../profileData'; // 경로 수정

const initialState = {
    userLocation: null,
    likedProfiles: [],
    userProfile: null,
    status: 'idle',
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        fetchUserProfile(state, action) {
            const userId = action.payload;
            const userProfile = profiles.find(profile => profile.id === userId);
            state.userProfile = userProfile || null;
        },
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
});

export const {
    fetchUserProfile,
    updateUserLocation,
    likeProfile,
    unlikeProfile,
    setLikedProfiles,
    updateUserProfile,
} = profileSlice.actions;

export const selectUserProfile = (state) => state.profile.userProfile;

export default profileSlice.reducer;