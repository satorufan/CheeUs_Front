import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profiles from '../profileData'; 
import axios from 'axios';


const loggedInUserId = 1; 

const initialState = {
    userLocation: null,
    likedProfiles: [],
    userProfile: null,
    locationOk: null,
    matchServiceAgreed: false,
    profiles: profiles,
    status: 'idle',
    error: null,
    shuffledProfiles: [],
    currentIndex: 0,
    showMessages: [],
};

export const updateLocationPermission = createAsyncThunk(
    'match/updateLocationPermission',
    async (userId) => {
        const user = profiles.find(profile => profile.id === userId);
        const updatedUser = { ...user, location_ok: 1 };
        
        const response = await axios.put(`https://your-server-api-url/updateLocationPermission/${userId}`, updatedUser);
        return response.data;
    }
);

export const updateMatchServiceAgreement = createAsyncThunk(
    'match/updateMatchServiceAgreement',
    async (userId) => {
        const user = profiles.find(profile => profile.id === userId);
        const updatedUser = { ...user, match_ok: 1 };
        
        const response = await axios.put(`https://your-server-api-url/updateMatchServiceAgreement/${userId}`, updatedUser);
        return response.data;
    }
);

const matchSlice = createSlice({
    name: 'match',
    initialState,
    reducers: {
        setUserLocation(state, action) {
            const { latitude, longitude } = action.payload.coords; 
            state.userLocation = { latitude, longitude };
            state.locationOk = true;
        },
        setLocationDenied(state) {
            state.locationOk = false;
        },
        setMatchServiceAgreement(state, action) {
            state.matchServiceAgreed = action.payload;
        },
        setShuffledProfiles(state, action) {
            state.shuffledProfiles = action.payload;
            state.showMessages = Array(action.payload.length).fill('');
            state.currentIndex = action.payload.length;
        },
        updateShowMessages(state, action) {
            const { index, message } = action.payload;
            state.showMessages[index] = message;
        },
        decrementIndex(state) {
            state.currentIndex -= 1;
        },
        resetIndex(state) {
            state.currentIndex = -1;
        },
        updateConfirmedList(state, action) {
            const profileId = action.payload;
            state.shuffledProfiles = state.shuffledProfiles.map(profile => {
                if (profile.id === profileId) {
                    return {
                        ...profile,
                        confirmedlist: [...profile.confirmedlist, loggedInUserId],
                    };
                }
                return profile;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateLocationPermission.fulfilled, (state, action) => {
                state.userProfile = action.payload;
                state.locationOk = true;
            })
            .addCase(updateMatchServiceAgreement.fulfilled, (state, action) => {
                state.userProfile = action.payload;
                state.matchServiceAgreed = true;
            });
    },
});

export const selectProfiles = (state) => state.match.profiles;
export const selectShuffledProfiles = (state) => state.match.shuffledProfiles;
export const selectCurrentIndex = (state) => state.match.currentIndex;
export const selectShowMessages = (state) => state.match.showMessages;

export const {
    setUserLocation,
    setLocationDenied,
    setMatchServiceAgreement,
    setShuffledProfiles,
    updateShowMessages,
    decrementIndex,
    resetIndex,
    updateConfirmedList,
} = matchSlice.actions;

export const selectUserLocation = (state) => state.match.userLocation;
export const selectLocationOk = (state) => state.match.locationOk;
export const selectMatchServiceAgreed = (state) => state.match.matchServiceAgreed;
export const selectUserProfile = (state) => state.match.userProfile;

export default matchSlice.reducer;
