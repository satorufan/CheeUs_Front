import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('http://localhost:8080/dtBoard/')
        .then(response => setPosts(response.data))
        .catch(error => console.error('리스트 로딩 중 오류 발생', error));
  }, []);

  const deletePost = (id) => {
    axios.delete(`http://localhost:8080/dtBoard/delete/${id}`)
        .then(() => {
          setPosts(posts.filter(post => post.id !== id));
        })
        .catch(error => {
          console.error('게시물 삭제 중 오류 발생:', error);
        });
  };

  const addPost = async (title, content, time, nickname, memberEmail) => {
    var id;
    console.log(memberEmail);
    const newPost = {
      title,
      content,
      time,
      nickname,
      author_id : memberEmail,
      location: selectedPlace ? selectedPlace.title : '선택한 장소가 없습니다.',
      address: selectedPlace?.address || '',
      latitude: selectedPlace?.latitude || null,
      longitude: selectedPlace?.longitude || null,
    };
    await axios.post('http://localhost:8080/dtBoard/insert', newPost)
      .then(async (response) => {
        setPosts([...posts, { ...newPost, id: response.data.id }]); // 서버에서 반환된 id 사용
        id = response;
      })
      .catch(error => console.error(error));
      
    console.log("Created Room : ", id.data);

    const req = { 
      together_id : newPost.title, 
      members : [newPost.author_id], 
      id: id.data,
      blacklist : []
    };

    const newMessage = {
      sender_id: 'System',
      message: '방이 생성되었습니다.',
      write_day: new Date().toISOString(),
      read: [newPost.author_id],
      room_id : id.data
    };

    const createRoom = 'http://localhost:8889/api/createTogetherRoom';
    const sendMessage = 'http://localhost:8889/api/togetherMessages';

    await axios.post(createRoom, req).then(res=>console.log(res)).catch(err=>console.log(err));
    await axios.post(sendMessage, newMessage);

    navigate('/dtboard'); // 게시글 작성 후 게시판으로 이동
    window.location.reload();
  };
  
  const modifyPost = (id, title, content, time, nickname, memberEmail) => {
    console.log(memberEmail);
    const modifiedPost = {
      id,
      title,
      content,
      time,
      nickname,
      author_id : memberEmail,
      location: selectedPlace ? selectedPlace.title : '선택한 장소가 없습니다.',
      address: selectedPlace?.address || '',
      latitude: selectedPlace?.latitude || null,
      longitude: selectedPlace?.longitude || null,
    };
    axios.put(`http://localhost:8080/dtBoard/update`, modifiedPost)
        .then(() => {
          setPosts(posts.map(post => (post.id === id ? modifiedPost : post)));
        })
        .catch(error => console.error(error));
  };

  const addScrap = async (serverUrl, memberEmail, id, title, token, url, category) => {
    const scrapInfo = {
      memberEmail : memberEmail,
      boardId : category == 1 ? id : null,
      togetherId : category == 2 ? id : null,
      eventId : category == 3 ? id : null,
      magazineId : category == 4 ? id : null,
      title : title,
      url : url
    };
    const response = await axios.post(`${serverUrl}/profile/addScrap`, scrapInfo, {
      headers : {
        "Authorization" : `Bearer ${token}`
      },
      withCredentials : true
    })
    return response.data.body;
  };

  const checkScrap = async (serverUrl, memberEmail, id, token, category) => {
    const response = await axios.get(`${serverUrl}/profile/scrap`, {
      params : {
        email : memberEmail
      }, 
      headers : {
        "Authorization" : `Bearer ${token}`
      },
      withCredentials : true
    })
    var check;
    if(category == 1) check = response.data.filter(post=> post.boardId == id);
    if(category == 2) check = response.data.filter(post=> post.togetherId == id);
    if(category == 3) check = response.data.filter(post=> post.eventId == id);
    if(category == 4) check = response.data.filter(post=> post.magazineId == id);
    console.log(check, category)

    return check.length > 0 ? true : false;
  }


  const toggleLike = async (serverUrl, id, authorId) => {
    try {
      const response = await axios.put(
          `${serverUrl}/dtBoard/toggleLike/${id}`,
          {},
          {
            params: { authorId }, 
            withCredentials: true,
          }
        );
      console.log(response);
      if (response.data.success) {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === id
                    ? { ...post, like: response.data.updatedLikeCount, isLiked: response.data.isLiked }
                    : post
            )
        );
        return { updatedLikeCount: response.data.updatedLikeCount, isLiked: response.data.isLiked };
      }
      throw new Error('Toggle like failed');
    } catch (error) {
      console.error('좋아요 토글에서 에러남 ', error);
      throw error;
    }
  };

  const userLiked = async (serverUrl, id, authorId) => {
    try {
        const response = await axios.get(`${serverUrl}/dtBoard/userLiked/${id}`, {
            params: { authorId }, // Query parameter를 전달
            withCredentials: true,
        });
        return response.data.userIsLiked; // 서버에서 반환한 userIsLiked 값을 반환
    } catch (error) {
        console.error("API request failed:", error.response?.data || error.message);
        throw error;
    }
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost, modifyPost, selectedPlace, setSelectedPlace, deletePost, addScrap, checkScrap,
      toggleLike, userLiked}}>
      {children}
    </PostContext.Provider>
  );
};
