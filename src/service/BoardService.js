import axios from 'axios';

const BOARD_LIST_URL = "http://localhost:8080/board/";

class BoardService {

    getBoards() {
        return axios.get(BOARD_LIST_URL);
    }
}

export default new BoardService();