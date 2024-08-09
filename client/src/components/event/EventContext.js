import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Event');
        const fetchedEvents = response.data;

        // 데이터 구조 확인
        console.log("Fetched Events Data:", fetchedEvents);

        // 데이터 구조를 확인하고 적절하게 처리
        if (Array.isArray(fetchedEvents)) {
          setEvents({ event: fetchedEvents }); // 배열을 객체 형태로 감싸기
        } else {
          setEvents(fetchedEvents); // 원래 형태를 유지
          console.log(" *EventContext* " + fetchedEvents); // 데이터를 확인하는 부분
        }
      } catch (error) {
        console.error("Error fetching events data: ", error);
      }
    };

    fetchEvents();
  }, []);

  const incrementViewCount = async (serverUrl, id, token) => {
    try {
      await axios.post(`${serverUrl}/event/incrementView/${id}`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setEvents(prevEvents => {
        const updatedEvents = { ...prevEvents };
        const eventToUpdate = Object.values(updatedEvents.event).find(event => event.id === id);
        if (eventToUpdate) {
          eventToUpdate.views += 1;
        }
        return updatedEvents;
      });
    } catch (error) {
      console.error('조회수 카운팅 에러-EventContext.js', error);
    }
  };

  const toggleLike = async (serverUrl, id, token) => {
    try {
      const response = await axios.post(`${serverUrl}/event/toggleLike/${id}`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setEvents(prevEvents => {
          const updatedEvents = { ...prevEvents };
          const eventToUpdate = Object.values(updatedEvents.event).find(event => event.id === id);
          if (eventToUpdate) {
            eventToUpdate.like = response.data.liked ? eventToUpdate.like + 1 : eventToUpdate.like - 1;
          }
          return updatedEvents;
        });
      }
    } catch (error) {
      console.error('좋아요 토글 에러-EventContext.js', error);
    }
  };


  return (
      <EventContext.Provider value={{ events, setEvents, incrementViewCount, toggleLike }}>
        {children}
      </EventContext.Provider>
  );
};
