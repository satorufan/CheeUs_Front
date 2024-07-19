import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './store/ProfileSlice';
import matchReducer from './store/MatchSlice';
import boardReducer from './store/BoardSlice';
import chatReducer from './store/ChatSlice';
import commentReducer from './store/CommentSlice';

const store = configureStore({
    reducer: {
        profile: profileReducer,
        match: matchReducer,
        board: boardReducer,
        chat: chatReducer,
        comments: commentReducer,
    },
});

export default store;