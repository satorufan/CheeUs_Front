import React, { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([
    { id: 1, title: '호수공원 벤치에서 맥주드실분', description: '잠실역 8번출구  ', lat: 37.5665, lng: 126.9780, time: ' 2024.07.01 18:30', content: 'content1',address: '1' },
    { id: 2, title: '다운타운에서 맥주 같이드실분', description: '다운타운 잠실점  ', lat: 37.5700, lng: 126.9770, time: ' 2024.07.02 18:30', content: 'content2',address: '2' },
    { id: 3, title: '피맥 조지실분 선착순 3명 구합니다', description: '피자네버슬립스-잠실점  ', lat: 37.5700, lng: 126.9760, time: ' 2024.07.03 18:30', content: 'content3',address: '3' },
    { id: 4, title: '곱소하실분 - 나루역 4출 4명', description: '잠실나루역 4번출구  ', lat: 37.5730, lng: 126.9770, time: ' 2024.07.04 18:30', content: 'content4',address: '4' },
    { id: 5, title: '참치 배터지게 드실분있나요?', description: '참치가좋다 잠실나루점  ', lat: 37.5700, lng: 126.9760, time: ' 2024.07.05 18:30', content: 'content5',address: '5' },
  ]);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const addPost = (title, content, time) => {
    const placeDescription = selectedPlace ? `${selectedPlace.title} ` : '선택한 장소가 없습니다.';
    const placeAddress = selectedPlace ? `${selectedPlace.addressName}` : '해당하는 주소가 없습니다.'
    const newPost = {
      id: posts.length + 1,
      title,
      description: placeDescription,
      content,
      address : placeAddress,
      time,
      lat: selectedPlace?.lat || null,
      lng: selectedPlace?.lng || null,
    };
    setPosts([...posts, newPost]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, selectedPlace, setSelectedPlace }}>
      {children}
    </PostContext.Provider>
  );
};
