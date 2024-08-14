import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from '../login/OAuth';
import axios from 'axios';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(null);
  const { serverUrl, token, memberEmail } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Event');
        const fetchedEvents = response.data;

        // 각 이벤트에 thumbnail 값을 추가
        const eventsWithThumbnails = fetchedEvents.map(event => {
          const thumbnailMatch = event.content.match(/!\[alt text]\((https:\/\/[^\s]+)\)/);
          const thumbnail = thumbnailMatch ? thumbnailMatch[0] : null;
          return {
            ...event,
            thumbnail: thumbnail || event.photoes, // 썸네일이 없으면 기본 이미지 사용
          };
        });

        // 데이터 구조를 확인하고 적절하게 처리
        if (Array.isArray(eventsWithThumbnails)) {
          setEvents({ event: eventsWithThumbnails }); // 배열을 객체 형태로 감싸기
        } else {
          setEvents(eventsWithThumbnails); // 원래 형태를 유지
          console.log(" *EventContext* " + eventsWithThumbnails); // 데이터를 확인하는 부분
        }
      } catch (error) {
        console.error("Error fetching events data: ", error);
      }
    };

    fetchEvents();
  }, []);

  const toggleLike = async (serverUrl, eventId, token, memberEmail) => {
    try {
      const response = await axios.put(
          `${serverUrl}/Event/toggleLike/${eventId}`,
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
    <EventContext.Provider value={{ events, setEvents, toggleLike }}>
      {children}
    </EventContext.Provider>
  );
};
