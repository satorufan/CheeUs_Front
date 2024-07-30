const http = require('http');
const socketIo = require('socket.io');
const expressApp = require('./server')
const httpServer = http.createServer(expressApp);

const io = socketIo(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // 클라이언트 주소
    methods: ['GET', 'POST']
  }
});


require('./io')(io); // 소켓 설정 파일에 io 객체를 전달

httpServer.listen(8888, () => {
    console.log(`>>>> Server is running on http://localhost:${process.env.SERVER_PORT || 8888} <<<<`);
});