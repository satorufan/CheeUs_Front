import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './store/ProfileSlice';
import matchReducer from './store/MatchSlice';
import boardReducer from './store/BoardSlice';

const store = configureStore({
    reducer: {
        profile: profileReducer,
        match: matchReducer,
        board: boardReducer,
    },
});

export default store;