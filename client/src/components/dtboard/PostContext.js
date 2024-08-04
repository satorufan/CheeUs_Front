import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  
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

  const addPost = async (title, content, time, nickname, memberEmail ) => {
    var id;
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
    const createRoom = 'http://localhost:8889/api/createTogetherRoom';
    const sendMessage = 'http://localhost:8889/api/togetherMessages';
    const req = { 
      title : newPost.title, 
      member : newPost.author_id, 
      id: id.data 
    };
    console.log(req);
    await axios.post(createRoom, req).then(res=>console.log(res)).catch(err=>console.log(err));
    // await axios.post(sendMessage, "방이 생성되었습니다.");
  };
  
  const modifyPost = (id, title, content, time, nickname, memberEmail) => {
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

  return (
    <PostContext.Provider value={{ posts, addPost, modifyPost, selectedPlace, setSelectedPlace, deletePost}}>
      {children}
    </PostContext.Provider>
  );
};
