import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 초기 상태
const initialState = {
    userLocation: null,
    likedProfiles: [],
    userProfile: null,
    status: 'idle', // 요청 상태
    error: null, // 오류 정보
};

// 사용자 프로필을 가져오는 thunk
export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async ({ serverUrl, memberEmail }) => {
        const response = await axios.get(`${serverUrl}/profile`, {
            params: { email: memberEmail }
        });
        console.log(response.data);
        return response.data; // 프로필 데이터 반환
    }
);

// 사용자 프로필 업데이트 thunk
export const updateUserProfileThunk = createAsyncThunk(
    'profile/updateUserProfile',
    async ({ serverUrl, profile }) => {
        const response = await axios.put(`${serverUrl}/profile`, profile);
        return response.data; // 업데이트된 프로필 데이터 반환
    }
);

const ProfileSlice = createSlice({
    name: 'profile', // 슬라이스 이름
    initialState,
    reducers: {
        updateUserLocation(state, action) {
            state.userLocation = action.payload; // 위치 업데이트
        },
        likeProfile(state, action) {
            const profileId = action.payload;
            if (!state.likedProfiles.includes(profileId)) {
                state.likedProfiles.push(profileId); // 좋아요 추가
            }
        },
        unlikeProfile(state, action) {
            const profileId = action.payload;
            state.likedProfiles = state.likedProfiles.filter(id => id !== profileId); // 좋아요 취소
        },
        setLikedProfiles(state, action) {
            state.likedProfiles = action.payload; // 좋아요 프로필 설정
        },
        updateUserProfile(state, action) {
            state.userProfile = { ...state.userProfile, ...action.payload }; // 프로필 업데이트
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading'; // 로딩 중
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded'; // 성공
                state.userProfile = action.payload; // 프로필 데이터 저장
                state.error = null; // 오류 초기화
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed'; // 실패
                state.error = action.error.message; // 오류 메시지 저장
                state.userProfile = null; // 프로필 초기화
            })
            .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
                state.userProfile = action.payload; // 업데이트된 프로필 저장
            });
    },
});

// 액션 내보내기
export const {
    updateUserLocation,
    likeProfile,
    unlikeProfile,
    setLikedProfiles,
    updateUserProfile,
} = ProfileSlice.actions;

// 선택자 내보내기
export const selectUserProfile = (state) => state.profile.userProfile;
export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileError = (state) => state.profile.error;

export default ProfileSlice.reducer;
