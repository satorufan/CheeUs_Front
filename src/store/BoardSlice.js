import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boards: [
    {
      id: 1,
      author_id: 101,
      author_name: "티라노사우르스",
      category: 1,
      title: "첫 번째 게시물",
      content: "첫 번째 게시물 내용입니다.agdagadgadgadsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddagdadagaeadgadgadgadgadgadgadgadgadgadgadgadadgadgadagd",
      writeday: "2024-07-11",
      views: 50,
      like: 10,
      repl_cnt: 3,
      photoes: "https://www.w3schools.com/w3images/mac.jpg",
    },
    {
      id: 2,
      author_id: 102,
      author_name: "Jane Smith",
      category: 1,
      title: "두 번째 게시물",
      content: "두 번째 게시물 내용입니다.",
      writeday: "2024-07-10",
      views: 30,
      like: 5,
      repl_cnt: 2,
      photoes: "",
    },
    {
      id: 3,
      author_id: 103,
      author_name: "Michael Johnson",
      category: 1,
      title: "세 번째 게시물",
      content: "세 번째 게시물 내용입니다.",
      writeday: "2024-07-09",
      views: 20,
      like: 8,
      repl_cnt: 1,
      photoes: "",
    },
    {
      id: 4,
      author_id: 104,
      author_name: "Emily Brown",
      category: 1,
      title: "네 번째 게시물",
      content: "네 번째 게시물 내용입니다.",
      writeday: "2024-07-08",
      views: 25,
      like: 6,
      repl_cnt: 2,
      photoes: "https://www.w3schools.com/html/frenchfood.jpg",
    },
  ],
  likedMap: {},
  videos: [
    {
      id: 1,
      author_id: 101,
      author_name: '뭐임마',
      category: 1,
      title: '첫 번째 비디오 게시물',
      content: '첫 번째 비디오 게시물 어쩌고 저쩌고',
      writeday: '2024-07-11',
      views: 50,
      like: 10,
      repl_cnt: 3,
      media: 'V',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
      id: 2,
      author_id: 102,
      author_name: 'Jane Smith',
      category: 1,
      title: '두 번째 비디오 게시물',
      content: '두 번째 비디오 게시물',
      writeday: '2024-07-10',
      views: 30,
      like: 5,
      repl_cnt: 2,
      media: 'V',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    },
    {
      id: 3,
      author_id: 103,
      author_name: 'Michael Johnson',
      category: 2,
      title: '세 번째 비디오 게시물',
      content: '세 번째 비디오 게시물',
      writeday: '2024-07-09',
      views: 20,
      like: 8,
      repl_cnt: 1,
      media: 'V',
      videoUrl: 'https://assets.codepen.io/6093409/river.mp4',
    },
  ],
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    toggleLike(state, action) {
      const id = action.payload;
      state.likedMap[id] = !state.likedMap[id]; // 좋아요 상태 토글
    },
    addBoard(state, action) {
      state.boards.push(action.payload); // 새로운 게시물 추가
    },
    deleteBoard(state, action) {
      const id = action.payload;
      state.boards = state.boards.filter(board => board.id !== id); // 게시물 삭제
    },
    updateBoard(state, action) {
      const { id, updatedData } = action.payload;
      const index = state.boards.findIndex(board => board.id === id);
      if (index !== -1) {
        state.boards[index] = { ...state.boards[index], ...updatedData }; // 게시물 업데이트
      }
    },
  },
});

// 액션과 선택자 내보내기
export const { toggleLike, addBoard, deleteBoard, updateBoard } = boardSlice.actions;
export const selectBoards = (state) => state.board.boards;
export const selectLikedMap = (state) => state.board.likedMap;
export const selectVideos = (state) => state.board.videos;

export default boardSlice.reducer;