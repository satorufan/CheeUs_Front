import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    userLocation: null,
    likedProfiles: [],
    userProfile: null,
    locationOk: null,
    matchServiceAgreed: false,
    profiles: [],
    status: 'idle',
    error: null,
    shuffledProfiles: [],
    currentIndex: 0,
    showMessages: [],
};

// 타 멤버 프로필을 가져오는 thunk
export const fetchUserProfiles = createAsyncThunk(
    'match/fetchUserProfiles',
    async ({ serverUrl, memberEmail }) => {
        if (!memberEmail) {
            throw new Error("Member email is required");
        }
        try {
            const response = await axios.get(`${serverUrl}/match`, { params: { email: memberEmail } });
            const profiles = response.data.map(data => {
                const imageBlob = data.imageBlob.map((blob, index) => `data:${data.imageType[index]};base64,${blob}`);
                return {
                    profile: {
                        ...data.profile,
                        popularity: data.popularity
                    },
                    imageBlob: imageBlob
                };
            });
            return profiles;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

// 위치 정보 동의
export const updateLocationPermission = createAsyncThunk(
    'match/updateLocationPermission',
    async ({ memberEmail, serverUrl, latitude, longitude, token }) => {
        const formData = new FormData();
        formData.append("email", memberEmail);
        formData.append("type", "location");
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);

        const response = await axios.put(`${serverUrl}/profile/allow`, formData, {
            headers : {
                "Authorization" : `Bearer ${token}`
            },
            withCredentials : true
            }
        );
        return response.data;
    }
);

// 매칭 동의
export const updateMatchServiceAgreement = createAsyncThunk(
    'match/updateMatchServiceAgreement',
    async ({ memberEmail, serverUrl, token }) => {
        const formData = new FormData();
        formData.append("email", memberEmail);
        formData.append("type", "match");

        const response = await axios.put(`${serverUrl}/profile/allow`, formData, {
            headers : {
                "Authorization" : `Bearer ${token}`
            },
            withCredentials : true
            }
        );
        return response.data;
    }
);

const MatchSlice = createSlice({
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
            const { profileId } = action.payload;
            if (state.loggedInUserId) {
                state.shuffledProfiles = state.shuffledProfiles.map(profile => {
                    if (profile.profile.id === profileId) {
                        return {
                            ...profile,
                            confirmedlist: [...profile.confirmedlist, state.loggedInUserId],
                        };
                    }
                    return profile;
                });
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateLocationPermission.fulfilled, (state, action) => {
                const updatedProfile = action.payload;
                state.userProfile = updatedProfile;
                state.locationOk = updatedProfile.location_ok === 1;
            })
            .addCase(updateMatchServiceAgreement.fulfilled, (state, action) => {
                const updatedProfile = action.payload;
                state.userProfile = updatedProfile;
                state.matchServiceAgreed = updatedProfile.match_ok === 1;
            })
            .addCase(fetchUserProfiles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfiles.fulfilled, (state, action) => {
                state.profiles = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchUserProfiles.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            });
    },
});

export const {
    setUserLocation,
    setLocationDenied,
    setMatchServiceAgreement,
    setShuffledProfiles,
    updateShowMessages,
    decrementIndex,
    resetIndex,
    updateConfirmedList,
    setLoggedInUserId,
} = MatchSlice.actions;

export const selectProfiles = (state) => state.match.profiles;
export const selectStatus = (state) => state.match.status;
export const selectShuffledProfiles = (state) => state.match.shuffledProfiles;
export const selectCurrentIndex = (state) => state.match.currentIndex;
export const selectShowMessages = (state) => state.match.showMessages;
export const selectUserLocation = (state) => state.match.userLocation;
export const selectLocationOk = (state) => state.match.locationOk;
export const selectMatchServiceAgreed = (state) => state.match.matchServiceAgreed;
export const selectUserProfile = (state) => state.match.userProfile;

export default MatchSlice.reducer;
