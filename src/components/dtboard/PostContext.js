import React, { createContext, useContext, useEffect, useState } from 'react';
import { id } from 'date-fns/locale';
import axios from "axios";

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // useEffect(() => {
  //   axios.get('http://localhost:8080/dtBoard/')
  //       .then(response => setPosts(response.data))
  //       .catch(error => console.error('Error loading list', error));
  // }, []);

  const deletePost = (id) => {
    axios.delete(`http://localhost:8080/dtBoard/delete/${id}`)
        .then(() => {
          setPosts(posts.filter(post => post.id !== id));
        })
        .catch(error => {
          console.error('Error deleting post:', error);
        });
  };

  /*
  const deletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };
   */

  const addPost = (title, content, time) => {

    const placeDescription = selectedPlace ? `${selectedPlace.title}` : '선택한 장소가 없습니다.';
    const placeAddress = selectedPlace.address
    const newPost = {
      title,
      location: placeDescription,
      content,
      time,
      latitude: selectedPlace?.latitude || null,
      longitude: selectedPlace?.longitude || null,
    };
    axios.post('http://localhost:8080/dtBoard/insert', newPost)
        .then(() => {
          setPosts([...posts, newPost]);
        })
        .catch(error => console.error(error));
  };
  
  // useEffect(() => {
  //   axios.get('http://localhost:8080/dtBoard/')
  //       .then(response => setPosts(response.data))
  //       .catch(error => console.error('Error loading list', error));
  // }, []);
  
  const modifyPost = (title, content, time) => {
    const placeDescription = selectedPlace ? `${selectedPlace.title}` : '선택한 장소가 없습니다.';
    const placeAddress = selectedPlace.address
    const modifiedPost = {
      id: id,
      title,
      location: placeDescription,
      content,
      address : placeAddress,
      time,
      latitude: selectedPlace?.latitude || null,
      longitude: selectedPlace?.longitude || null,
    };
    setPosts([posts.filter((post) => post.id !== id), modifiedPost]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, modifyPost, selectedPlace, setSelectedPlace, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};
