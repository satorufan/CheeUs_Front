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
    {
      id: 8,
      author_id: 'rbfl8484@gmail.com',
      author_name: "안녕",
      category: 3,
      title: "맥주 빨리마시기 대회",
      content: "맥주를 빨리마시면 숙취를 얻습니다.",
      writeday: "2024-07-09",
      views: 20,
      like: 8,
      repl_cnt: 1,
      photoes: "",
    },
    {
      id: 9,
      author_id: 105,
      author_name: "빙그레",
      category: 3,
      title: "바나나 막걸리 먹으면",
      content: "나한테 바나나?그래서 말걸리?",
      writeday: "2024-07-09",
      views: 20,
      like: 8,
      repl_cnt: 1,
      photoes: "",
    },
  ],
  filteredBoards: [], // 필터링된 게시물 목록
  searchQuery: '', // 검색어 상태
  likedMap: {},
};

// 게시물 목록을 가져오는 thunk
export const fetchBoards = createAsyncThunk(
  'board/fetchBoards',
  async () => {
    const response = await axios.get('http://localhost:8080/boards');
    return response.data;
  }
);

// 게시물 추가를 위한 thunk
export const addBoard = createAsyncThunk(
  'board/addBoard',
  async (boardData) => {
    const formData = new FormData();
    formData.append('title', boardData.title);
    formData.append('content', boardData.content);
    formData.append('videoFile', boardData.videoFile);

    const response = await axios.post('http://localhost:8080/boards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// 게시물 업데이트를 위한 thunk
export const updateBoard = createAsyncThunk(
  'board/updateBoard',
  async (updatedBoard) => {
    const { id, ...updatedData } = updatedBoard;
    const response = await axios.put(`http://localhost:8080/boards/${id}`, updatedData);
    return response.data;
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
      state.filteredBoards = state.filteredBoards.filter(board => board.id !== id); // 필터링된 게시물 목록에서도 삭제
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload; // 검색어 업데이트
    },
    filterBoards(state) {
      const query = state.searchQuery.toLowerCase();
      state.filteredBoards = state.boards.filter(board =>
        board.title.toLowerCase().includes(query) ||
        board.content.toLowerCase().includes(query)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload; // 게시물 목록 업데이트
        state.filteredBoards = action.payload; // 초기 필터링된 게시물 목록 설정
      })
      .addCase(addBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload); // 새로운 게시물 추가
        state.filteredBoards.push(action.payload); // 새로운 게시물도 필터링 목록에 추가
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        const updatedBoard = action.payload;
        const index = state.boards.findIndex(board => board.id === updatedBoard.id);
        if (index !== -1) {
          state.boards[index] = updatedBoard; // 업데이트된 게시물로 변경
          state.filteredBoards[index] = updatedBoard; // 필터링된 게시물 목록도 업데이트
        }
      });
  },
});

export const { toggleLike, deleteBoard, setSearchQuery, filterBoards } = boardSlice.actions;
export const selectBoards = (state) => state.board.boards;
export const selectFilteredBoards = (state) => state.board.filteredBoards;
export const selectSearchQuery = (state) => state.board.searchQuery;
export const selectLikedMap = (state) => state.board.likedMap;

export default boardSlice.reducer;