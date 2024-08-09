import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthContext} from '../login/OAuth';
import axios from 'axios';

const MagazineContext = createContext();

export const useMagazines = () => useContext(MagazineContext);

export const MagazineProvider = ({ children }) => {
  const [magazines, setMagazines] = useState(null);
  const {token} = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Magazine');
        const fetchedMagazines = response.data;

        // 데이터 구조 확인
        console.log("Fetched Magazines Data:", fetchedMagazines);

        // 데이터 구조를 확인하고 적절하게 처리
        if (Array.isArray(fetchedMagazines)) {
          setMagazines({ magazine: fetchedMagazines }); // 배열을 객체 형태로 감싸기
        } else {
          setMagazines(fetchedMagazines); // 원래 형태를 유지
          console.log(" *EventContext* " + fetchedMagazines); // 데이터를 확인하는 부분
        }
      } catch (error) {
        console.error("Error fetching events data: ", error);
      }
    };

    fetchEvents();
  }, []);

  return (
      <MagazineContext.Provider value={{ magazines }}>
        {children}
      </MagazineContext.Provider>
  );
};
