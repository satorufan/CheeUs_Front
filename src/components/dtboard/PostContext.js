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
        .catch(error => console.error(error));
  }, []);

  const deletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const addPost = (title, content, time) => {

    const placeDescription = selectedPlace ? `${selectedPlace.title}` : '선택한 장소가 없습니다.';
    const placeAddress = selectedPlace.address
    const newPost = {
      title,
      description: placeDescription,
      content,
      time,
      lat: selectedPlace?.lat || null,
      lng: selectedPlace?.lng || null,
    };
    axios.post('http://localhost:8080/dtBoard/insert', newPost)
        .then(() => {
          setPosts([...posts, newPost]);
        })
        .catch(error => console.error(error));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, selectedPlace, setSelectedPlace, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};
