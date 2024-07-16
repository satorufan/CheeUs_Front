import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './store/ProfileSlice';
import matchReducer from './store/MatchSlice';

const store = configureStore({
    reducer: {
        profile: profileReducer,
        match: matchReducer,
    },
});

export default store;