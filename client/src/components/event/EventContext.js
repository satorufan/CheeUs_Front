import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/AdminEvent');
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


/*
const dummyData = {
  event: {
    1: {
      id: 6,
      title: "CHEE US 6월 이벤트!",
      title2: "6월의 이벤트!",
      photoes: "/images/event6.jpg",
      content: "안녕하세요 CHEE US 여러분! 벌써 6월이 시작했네요~~~ 이번달의 이벤트는 바로.. 숏폼올리기 이벤트입니다. 경품도 준비되어있으니 많은 참여 부탁드립니다. 그럼 오늘부터 6월의 이벤트 시작합니다!",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2024-06-01",
    },
    2: {
      id: 7,
      title: "CHEE US 7월 이벤트!",
      title2: "7월의 이벤트!",
      photoes: "/images/event7.jpg",
      content: "안녕하세요 CHEE US 여러분! 벌써 7월이 시작했네요~~~ 이번달의 이벤트는 바로.. 숏폼올리기 이벤트입니다. 경품도 준비되어있으니 많은 참여 부탁드립니다. 그럼 오늘부터 7월의 이벤트 시작합니다!",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2024-07-01",
    },
    3: {
      id: 8,
      title: "CHEE US 8월 이벤트!",
      title2: "8월의 이벤트!",
      photoes: "/images/event8.jpg",
      content: "안녕하세요 CHEE US 여러분! 벌써 8월이 시작했네요~~~ 이번달의 이벤트는 바로.. 숏폼올리기 이벤트입니다. 경품도 준비되어있으니 많은 참여 부탁드립니다. 그럼 오늘부터 8월의 이벤트 시작합니다!",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2024-08-01",
    },
    4: {
      id: 9,
      title: "CHEE US 9월 이벤트!",
      title2: "9월의 이벤트!",
      photoes: "/images/event9.jpg",
      content: "안녕하세요 CHEE US 여러분! 벌써 9월이 시작했네요~~~ 이번달의 이벤트는 바로.. 숏폼올리기 이벤트입니다. 경품도 준비되어있으니 많은 참여 부탁드립니다. 그럼 오늘부터 9월의 이벤트 시작합니다!",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2024-09-01",
    },
    5: {
      id: 10,
      title: "CHEE US 10월 이벤트!",
      title2: "10월의 이벤트!",
      photoes: "/images/event10.jpg",
      content: "안녕하세요 CHEE US 여러분! 벌써 10월이 시작했네요~~~ 이번달의 이벤트는 바로.. 숏폼올리기 이벤트입니다. 경품도 준비되어있으니 많은 참여 부탁드립니다. 그럼 오늘부터 10월의 이벤트 시작합니다!",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2024-10-01",
    },
    6: {
      id: 11,
      title: "CHEE US 11월 이벤트!",
      title2: "11월의 이벤트!",
      photoes: "/images/event11.jpg",
      content: "안녕하세요 CHEE US 여러분! 벌써 11월이 시작했네요~~~ 이번달의 이벤트는 바로.. 숏폼올리기 이벤트입니다. 경품도 준비되어있으니 많은 참여 부탁드립니다. 그럼 오늘부터 11월의 이벤트 시작합니다!",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2024-11-01",
    },
    7: {
      id: 12,
      title: "CHEE US 12월 이벤트!",
      title2: "12월의 이벤트!",
      photoes: "/images/event12.jpg",
      content: "안녕하세요 CHEE US 여러분! 벌써 12월이 시작했네요~~~ 이번달의 이벤트는 바로.. 숏폼올리기 이벤트입니다. 경품도 준비되어있으니 많은 참여 부탁드립니다. 그럼 오늘부터 12월의 이벤트 시작합니다!",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2024-12-01",
    },
  },
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(dummyData);

  return (
    <EventContext.Provider value={{ events, setEvents }}>
      {children}
    </EventContext.Provider>
  );
};

 */
