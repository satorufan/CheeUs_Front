require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8889;
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  console.error('>>>> MONGODB_URI or DB_NAME is not set in .env file');
  process.exit(1);
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

// Middleware 설정
app.use(cors());
app.use(bodyParser.json());

// MongoDB 연결 함수
async function connectMongoDB() {
    try {
        await client.connect();
        console.log('>>>> Connected to MongoDB <<<<');
        db = client.db(dbName);
    } catch (error) {
        console.error('>>>> Failed to connect to MongoDB', error);
        process.exit(1);
    }
}

// 1:1 채팅 메시지 조회 API
app.get('/api/messages/:roomId', async (req, res) => {
    const roomId = parseInt(req.params.roomId, 10); 
    try {
        const messages = await db.collection('oneone_chat_messages').find({ chat_room_id: roomId }).toArray();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// 1:1 채팅방 조회 API
app.get('/api/chatRooms', async (req, res) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'oneone_chat_messages',
                    localField: 'id',
                    foreignField: 'chat_room_id',
                    as: 'messages'
                }
            },
            {
                $project: {
                    _id: 0,
                    roomId: '$id',
                    match:'$match',
                    member1: 1,
                    member2: 1,
                    match: '$match',
                    messages: {
                        $map: {
                            input: '$messages',
                            as: 'message',
                            in: {
                                senderId: '$$message.sender_id',
                                message: '$$message.message',
                                writeDay: '$$message.write_day',
                                read: '$$message.read'
                            }
                        }
                    }
                }
            }
        ];

        const oneChatRooms = await db.collection('oneone_chat_rooms').aggregate(pipeline).toArray();
        res.json(oneChatRooms);
    } catch (error) {
        console.error('>>>>Error fetching chat rooms:', error);
        res.status(500).json({ error: '>>>>Failed to fetch chat rooms' });
    }
});


// 1:1 채팅방 생성 API
app.post('/api/createOneoneRoom', async(req, res)=>{
    const newRoom = req.body;
    console.log(newRoom);
    try {
        const result = await db.collection('oneone_chat_rooms').insertOne(newRoom);
        console.log('>>>>Room Created:', result.insertedId);
        res.status(201).json({ message: '>>>>Message sent successfully' });
    } catch (err) {
        console.error('>>>>Error sending message:', error);
        res.status(500).json({ error: '>>>>Failed to send message' });

    }
});

// 1:1 채팅 메시지 생성 API
app.post('/api/messages', async (req, res) => {
    const newMessage = req.body;
    console.log(newMessage);
    try {
        const result = await db.collection('oneone_chat_messages').insertOne(newMessage);
        console.log('>>>>Message sent:', result.insertedId);
        res.status(201).json({ message: '>>>>Message sent successfully' });
    } catch (error) {
        console.error('>>>>Error sending message:', error);
        res.status(500).json({ error: '>>>>Failed to send message' });
    }
});

// 단체 채팅방 생성
app.post('/api/createTogetherRoom', async (req, res) => {
    const roomId = req.body.id;
    try {
        const messages = await db.collection('together_chat_rooms').insertOne({ 
            room_id: roomId,
            togetherId : req.body.title,
            members : [req.body.author_id]
        }).toArray();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages', req: req });
    }
});

// 단체 채팅 메시지 조회 API
app.get('/api/togetherMessages/:roomId', async (req, res) => {
    const roomId = parseInt(req.params.roomId, 10);
    try {
        const messages = await db.collection('together_chat_messages').find({ room_id: roomId }).toArray();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// 단체 채팅방 조회 API
app.get('/api/togetherChatRooms', async (req, res) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'together_chat_messages',
                    localField: 'id',
                    foreignField: 'room_id',
                    as: 'messages'
                }
            },
            {
                $project: {
                    _id: 0,
                    roomId: '$id',
                    togetherId: '$together_id', 
                    members: 1,
                    messages: {
                        $map: {
                            input: '$messages',
                            as: 'message',
                            in: {
                                senderId: '$$message.sender_id',
                                message: '$$message.message',
                                writeDay: '$$message.write_day',
                                read: '$$message.read'
                            }
                        }
                    }
                }
            }
        ];

        const togetherChatRooms = await db.collection('together_chat_rooms').aggregate(pipeline).toArray();
        res.json(togetherChatRooms);
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        res.status(500).json({ error: 'Failed to fetch chat rooms' });
    }
});

// 단체 채팅 메시지 생성 API
app.post('/api/togetherMessages', async (req, res) => {
    const newMessage = req.body;
    try {
        const result = await db.collection('together_chat_messages').insertOne(newMessage);
        console.log('>>>>Message sent:', result.insertedId);
        res.status(201).json({ message: '>>>>Message sent successfully' });
    } catch (error) {
        console.error('>>>>Error sending message:', error);
        res.status(500).json({ error: '>>>>Failed to send message' });
    }
});

// 1:1 메시지 읽음 상태 업데이트
app.put('/api/messages/:roomId/read', async (req, res) => {
    const { roomId } = req.params;
    try {
        const result = await db.collection('oneone_chat_messages').updateMany(
            { chat_room_id: parseInt(roomId, 10) },
            { $set: { read: 1 } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: '메시지를 찾을 수 없습니다' });
        }
        res.status(200).json({ message: '메시지 읽음 상태가 업데이트되었습니다' });
    } catch (error) {
        console.error('메시지 읽음 상태 업데이트 오류:', error);
        res.status(500).json({ error: '메시지 읽음 상태 업데이트 실패' });
    }
});

// 단체 메시지 읽음 상태 업데이트
app.put('/api/togetherMessages/:roomId/read', async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;

    if (!roomId) {
        return res.status(400).json({ error: 'roomId가 필요합니다' });
    }
    if (!userId) {
        return res.status(400).json({ error: 'userId가 필요합니다' });
    }
    try {
        const result = await db.collection('together_chat_messages').updateMany(
            { room_id: parseInt(roomId, 10) },
            { $addToSet: { read: userId } } // 배열로 유지
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: '메시지를 찾을 수 없습니다' });
        }
        res.status(200).json({ message: '메시지 읽음 상태가 업데이트되었습니다' });
    } catch (error) {
        console.error('단체 채팅 메시지 읽음 상태 업데이트 오류:', error);
        res.status(500).json({ error: '단체 채팅 메시지 읽음 상태 업데이트 실패' });
    }
});

// 1:1 채팅방 삭제 API
app.put('/api/chatRooms/:roomId', async (req, res) => {
    const roomId = parseInt(req.params.roomId, 10);
    try {
        const result = await db.collection('oneone_chat_rooms').updateOne(
            { id: roomId },
            { $set: { match: 3 } } // match 값을 3으로 업데이트
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: '채팅방을 찾을 수 없습니다' });
        }
        res.status(200).json({ message: '채팅방 상태가 업데이트되었습니다' });
    } catch (error) {
        console.error('채팅방 상태 업데이트 오류:', error);
        res.status(500).json({ error: '채팅방 상태 업데이트 실패' });
    }
});


// 단체 채팅방에서 사용자 제거 API
app.put('/api/togetherChatRooms/:roomId/leave', async (req, res) => {
    const roomId = parseInt(req.params.roomId, 10);
    const { userId } = req.body; // 나가려는 사용자의 ID

    if (!userId) {
        return res.status(400).json({ error: '사용자 ID가 필요합니다' });
    }

    try {
        // 1. 채팅방에서 사용자 제거
        const result = await db.collection('together_chat_rooms').updateOne(
            { id: roomId },
            { $pull: { members: userId } } // members 배열에서 userId를 제거
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: '단체 채팅방을 찾을 수 없습니다' });
        }

        // 2. 메시지의 read 배열에서 사용자 제거
        await db.collection('together_chat_messages').updateMany(
            { room_id: roomId },
            { $pull: { read: userId } } // read 배열에서 userId를 제거
        );

        res.status(200).json({ message: '채팅방에서 사용자 제거 완료' });
    } catch (error) {
        console.error('채팅방에서 사용자 제거 오류:', error);
        res.status(500).json({ error: '채팅방에서 사용자 제거 실패' });
    }
});

async function startServer() {
    console.log('>>>> Starting server...');
    try {
        await connectMongoDB();
        app.listen(port, () => {
            console.log(`>>>> server.js Server is running on http://localhost:${port} <<<<`);
        });
    } catch (error) {
        console.error('>>>> Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;