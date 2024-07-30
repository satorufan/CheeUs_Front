import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const loggedInUserId = 1;

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
        if (memberEmail) {
            const response = await axios.get(`${serverUrl}/match`, {params : {email : memberEmail}});
            const profiles = response.data.map(data => {
                const imageBlob = [];
                for (let i = 0; i < data.profile.photo; i++) {
                    imageBlob.push(`data:${data.imageType[i]};base64,${data.imageBlob[i]}`);
                }
                return {
                    profile: {
                        ...data.profile,
                        popularity: data.popularity
                    },
                    imageBlob: imageBlob
                };
            });
            console.log(response);
            return profiles;
        }
    }
);

// 위치 정보 동의
export const updateLocationPermission = createAsyncThunk(
    'match/updateLocationPermission',
    async ({memberEmail, serverUrl, latitude, longitude}) => {
        const formData = new FormData();

        formData.append("email", memberEmail);
        formData.append("type", "location");
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        
        const response = await axios.put(`${serverUrl}/profile/allow`, formData);
        return response.data;
    }
);

// 매칭 동의
export const updateMatchServiceAgreement = createAsyncThunk(
    'match/updateMatchServiceAgreement',
    async ({memberEmail, serverUrl}) => {
        const formData = new FormData();

        formData.append("email", memberEmail);
        formData.append("type", "match");
        
        const response = await axios.put(`${serverUrl}/profile/allow`, formData);
        return response.data;
    }
);

// firstLiker 먼저 좋아요 눌렀을 경우 목록 불러오기 -> 둘이마셔요에서 띄울지 말지 정하는 로직
export const loadFirstLike = createAsyncThunk(
    'match/loadFirstLike'
)

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
            const profileId = action.payload;
            state.shuffledProfiles = state.shuffledProfiles.map(profile => {
                if (profile.profile.id === profileId) {
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
                const updatedProfile = action.payload;
                state.userProfile = updatedProfile;
                state.locationOk = updatedProfile.location_ok === 1;
            })
            .addCase(updateMatchServiceAgreement.fulfilled, (state, action) => {
                const updatedProfile = action.payload;
                state.userProfile = updatedProfile;
                state.matchServiceAgreed = updatedProfile.match_ok === 1;
            })
            .addCase(fetchUserProfiles.fulfilled, (state, action) => {
                state.profiles = action.payload;
            })
            .addCase(fetchUserProfiles.rejected, (state, action) => {
                state.error = action.error.message;
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
} = MatchSlice.actions;

export const selectProfiles = (state) => state.match.profiles;
export const selectShuffledProfiles = (state) => state.match.shuffledProfiles;
export const selectCurrentIndex = (state) => state.match.currentIndex;
export const selectShowMessages = (state) => state.match.showMessages;
export const selectUserLocation = (state) => state.match.userLocation;
export const selectLocationOk = (state) => state.match.locationOk;
export const selectMatchServiceAgreed = (state) => state.match.matchServiceAgreed;
export const selectUserProfile = (state) => state.match.userProfile;
export default MatchSlice.reducer;