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

  const addPost = (title, content, time) => {
    const newPost = {
      title,
      content,
      time,
      location: selectedPlace ? selectedPlace.title : '선택한 장소가 없습니다.',
      address: selectedPlace?.address || '',
      latitude: selectedPlace?.latitude || null,
      longitude: selectedPlace?.longitude || null,
    };
    axios.post('http://localhost:8080/dtBoard/insert', newPost)
      .then(response => {
        setPosts([...posts, { ...newPost, id: response.data.id }]); // 서버에서 반환된 id 사용
      })
      .catch(error => console.error(error));
  };

  const modifyPost = (id, title, content, time) => {
    const modifiedPost = {
      id,
      title,
      content,
      time,
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
    <PostContext.Provider value={{ posts, addPost, modifyPost, selectedPlace, setSelectedPlace, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};
