import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchComments, addComment, deleteComment, updateComment } from './CommentSlice';

const initialState = {
  boards: [],
  filteredBoards: [],
  perPageBoardsMedia: [],
  boardsAuthors: [],
  searchQuery: '',
  likedMap: {},
};

// 카테고리에 따른 게시물 목록을 가져오는 thunk
export const fetchBoards = createAsyncThunk(
    'board/fetchBoards',
    async (category) => {
      const urlMap = {
        freeboard: 'http://localhost:8080/board/freeboard',
        shortform: 'http://localhost:8080/board/shortform',
        eventboard: 'http://localhost:8080/board/eventboard'
      };
      const response = await axios.get(urlMap[category]);
      console.log(response);
      return { category, data: response.data };
    }
);

// 이미지 및 영상 불러오기
export const fetchBoardsMedia = createAsyncThunk(
  'board.fetchBoardsMedia',
  async ({category, perPageBoards}) => {
    const urlMap = {
      freeboard: 'http://localhost:8080/board/freeboard/media',
      shortform: 'http://localhost:8080/board/shortform/media',
      eventboard: 'http://localhost:8080/board/eventboard/media'
    };
    const parameter = perPageBoards.map(board => ({
      id: board.id,
      photoes: board.photoes
    }));
    const encodedParameter = encodeURIComponent(JSON.stringify(parameter));
    const response = await axios.get(urlMap[category], {
      params: { board: encodedParameter }
    });
    const mediaMap = response.data.reduce((acc, data) => {
      // acc[data.id] = "data:" + data.types[0] + ";base64," + data.medias[0];
      acc[data.id] = data.types[0];
      return acc;
    }, {});
    return mediaMap;
  }
)

// 작성자 부럴오기
export const fetchBoardsAuthor = createAsyncThunk(
  'board.fetchBoardsAuthor',
  async ({category, perPageBoards}) => {
    const parameter = perPageBoards.map(board => ({
      email : board.author_id
    }));
    const encodedParameter = encodeURIComponent(JSON.stringify(parameter));
    const response = await axios.get('http://localhost:8080/match/loadBoardAuthor', {
      params : {emails : encodedParameter}
    })
    console.log(response);
    const mediaMap = response.data.reduce((acc, data) => {
      // acc[data.email] = "data:" + data.imageType + ";base64," + data.imageBlob;
      acc[data.email] = data.imageType;
      return acc;
    }, {});
    return mediaMap;
  }
)

// 게시물 추가를 위한 thunk
export const addBoard = createAsyncThunk(
    'board/addBoard',
    async (boardData) => {
      const file = boardData.file;
      const board = {...boardData};
      delete board.file;
      const formData = new FormData();
      formData.append('board', JSON.stringify(board)); // JSON 형태의 게시물 데이터
      if (file) {
        formData.append('file', file); // 파일 추가
      }
      console.log(board)
      const response = await axios.post('http://localhost:8080/board/insert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    }
);

// 게시물 업데이트를 위한 thunk
export const updateBoard = createAsyncThunk(
    'board/updateBoard',
    async (updatedBoard) => {
      const response = await axios.put(
          `http://localhost:8080/board/update/${updatedBoard.id}`,
          updatedBoard,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );
      // console.log("updated Data : ", updatedBoard); // 전송데이터 확인용
      // console.log("response Data : ", response.data); // 결과 확인용
      return response.data;
    }
);

// 좋아요 토글 >>>>
export const likeBoard = createAsyncThunk(
  'board/likeBoard',
  async ({ boardId, userEmail }) => { 
    try {
      console.log('Sending like request:', { boardId, userEmail });

      const response = await axios.post(
        `http://localhost:8080/board/like/${boardId}`, 
        { boardId, userEmail }, 
        {
          headers: {
            'Content-Type': 'application/json'
            // 'Authorization': `Bearer ${token}` // Authorization 헤더 제거
          }
        }
      );
      
      console.log('Response received:', response);

      return response.data;
    } catch (error) {
      console.error('Error liking board:', error);
      throw error;
    }
  }
);

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    toggleLike(state, action) { // 좋아요 상태 토글>>>>
      const id = action.payload;
      state.likedMap[id] = !state.likedMap[id]; 
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
          (board.title && board.title.toLowerCase().includes(query)) ||
          (board.content && board.content.toLowerCase().includes(query))
      );
    }, 
      
  },
    
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload.data; // 게시물 목록 업데이트
        state.filteredBoards = action.payload.data; // 초기 필터링된 게시물 목록 설정
      })
      .addCase(fetchBoardsMedia.fulfilled, (state, action) => {
        state.perPageBoardsMedia = action.payload; // 게시물 사진 업데이트
      })
      .addCase(fetchBoardsAuthor.fulfilled, (state, action) => {
        state.boardsAuthors = action.payload; // 게시물 사진 업데이트
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
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { boardId, comments } = action.payload;
        const board = state.boards.find(board => board.id === boardId);
        if (board) {
          board.repl_cnt = comments.length; // 댓글 수 업데이트
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { boardId } = action.payload;
        const board = state.boards.find(board => board.id === boardId);
        if (board) {
          board.repl_cnt += 1; // 댓글 추가에 따라 댓글 수 증가
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        state.boards.forEach(board => {
          if (board.repl_cnt > 0) {
            board.repl_cnt -= 1; // 댓글 삭제에 따라 댓글 수 감소
          }
        });
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        // 댓글 업데이트와 관련된 게시물 상태 업데이트는 현재 필요 없음
      });
  },
});

export const { toggleLike, deleteBoard, setSearchQuery, filterBoards } = boardSlice.actions;
export const selectBoards = (state) => state.board.boards;
export const selectPageBoardsMedia = (state) => state.board.perPageBoardsMedia;
export const selectBoardAuthors = (state) => state.board.boardsAuthors;
export const selectFilteredBoards = (state) => state.board.filteredBoards;
export const selectSearchQuery = (state) => state.board.searchQuery;
export const selectLikedMap = (state) => state.board.likedMap;

export default boardSlice.reducer;