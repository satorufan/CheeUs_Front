import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  boards: [
    {
      id: 1,
      author_id: 'rbfl8484@gmail.com',
      author_name: "안녕",
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
      author_id: 'abc',
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
    {
      id: 5,
      author_id: 'rbfl8484@gmail.com',
      author_name: '안녕',
      category: 2,
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
      id: 6,
      author_id: 102,
      author_name: 'Jane Smith',
      category: 2,
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
      id: 7,
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
  likedMap: {},
};

// 게시물 추가를 위한 thunk
export const addBoard = createAsyncThunk(
  'board/addBoard',
  async (boardData) => {
    //axios 넣기
    return boardData;
  }
);

// 게시물 업데이트를 위한 thunk
export const updateBoard = createAsyncThunk(
  'board/updateBoard',
  async (updatedBoard) => {
    const { id, ...updatedData } = updatedBoard;
    const response = await axios.put(`http://localhost:8080/boards/${id}`, updatedData);
    return response.data; // 업데이트된 게시물 데이터 반환
  }
);

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    toggleLike(state, action) {
      const id = action.payload;
      state.likedMap[id] = !state.likedMap[id]; // 좋아요 상태 토글
    },
    deleteBoard(state, action) {
      const id = action.payload;
      state.boards = state.boards.filter(board => board.id !== id); // 게시물 삭제
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload); // 새로운 게시물 추가
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        const updatedBoard = action.payload;
        const index = state.boards.findIndex(board => board.id === updatedBoard.id);
        if (index !== -1) {
          state.boards[index] = updatedBoard; // 업데이트된 게시물로 변경
          console.log('게시물이 업데이트되었습니다:', updatedBoard); // 콘솔에 수정 내역 출력
        }
      });
  },
});

export const { toggleLike, deleteBoard } = boardSlice.actions;
export const selectBoards = (state) => state.board.boards;
export const selectLikedMap = (state) => state.board.likedMap;

export default boardSlice.reducer;