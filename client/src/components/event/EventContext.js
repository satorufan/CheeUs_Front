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



  return (
      <EventContext.Provider value={{ events, setEvents }}>
        {children}
      </EventContext.Provider>
  );
};
