import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthContext} from '../login/OAuth';
import axios from 'axios';

const MagazineContext = createContext();

export const useMagazines = () => useContext(MagazineContext);

export const MagazineProvider = ({ children }) => {
  const [magazines, setMagazines] = useState(null);
  const { serverUrl, token, memberEmail } = useContext(AuthContext);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Magazine');
        const fetchedMagazines = response.data;

        // 각 매거진에 thumbnail 값을 추가
        const magazinesWithThumbnails = fetchedMagazines.map(magazine => {
          const thumbnailMatch = magazine.content.match(/!\[alt text]\((https:\/\/[^\s]+)\)/);
          const thumbnail = thumbnailMatch ? thumbnailMatch[0] : null;
          return {
            ...magazine,
            thumbnail: thumbnail || magazine.photoes, // 썸네일이 없으면 기본 이미지 사용
          };
        });

        // 데이터 구조를 확인하고 적절하게 처리
        if (Array.isArray(magazinesWithThumbnails)) {
          setMagazines({ magazine: magazinesWithThumbnails}); // 배열을 객체 형태로 감싸기
        } else {
          setMagazines(magazinesWithThumbnails); // 원래 형태를 유지
          console.log(" *MagazineContext* " + magazinesWithThumbnails); // 데이터를 확인하는 부분
        }
      } catch (error) {
        console.error("Error fetching magazines data: ", error);
      }
    };

    fetchMagazines();
  }, []);

  const toggleLike = async (serverUrl, magazineId, token, memberEmail) => {
    try {
      const response = await axios.put(
          `${serverUrl}/Magazine/toggleLike/${magazineId}`,
          {},
          {
            params: { memberEmail },
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
      );
      console.log("Response:", response.data);
      if (response.data.success) {
        return {
          updatedLikeCount: response.data.updatedLikeCount,
          isLiked: response.data.isLiked
        };
      }
      throw new Error('Toggle like failed');
    } catch (error) {
      console.error('좋아요 토글에서 에러남 ', error);
      throw error;
    }
  };

  return (
      <MagazineContext.Provider value={{ magazines, setMagazines, toggleLike }}>
        {children}
      </MagazineContext.Provider>
  );
};
