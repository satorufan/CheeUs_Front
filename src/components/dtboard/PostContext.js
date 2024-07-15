import React, { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([
    { id: 1, title: '호수공원 벤치에서 맥주드실분', description: 'Menu description.' },
    { id: 2, title: '다운타운에서 맥주 같이드실분', description: 'Menu description.' },
    { id: 3, title: '피맥 조지실분 선착순 3명 구합니다', description: '피자네버슬립스-잠실점 | 2024.07.03 6:30pm' },
    { id: 4, title: '곱소하실분 - 나루역 4출 4명', description: 'Menu description.' },
    { id: 5, title: '참치 배터지게 드실분있나요?', description: 'Menu description.' },
  ]);

 const [selectedPlace, setSelectedPlace] = useState(null);
 
  const addPost = (title, content) => {
    const newPost = {
      id: posts.length + 1,
      title: title,
      description: content,
    };
    setPosts([...posts, newPost]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, selectedPlace, setSelectedPlace }}>
      {children}
    </PostContext.Provider>
  );

};