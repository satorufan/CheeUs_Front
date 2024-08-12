import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const navigate = useNavigate();

  // 로컬 스토리지에서 초기 상태를 가져옴
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('isNotificationsEnabled');
    return saved === null ? true : JSON.parse(saved);
  });

  useEffect(() => {
    // 상태가 변경될 때 로컬 스토리지에 저장
    localStorage.setItem('isNotificationsEnabled', JSON.stringify(isNotificationsEnabled));
  }, [isNotificationsEnabled]);

  // 알림을 클릭했을 때 호출될 함수
  const handleToastClick = () => {
    if (isNotificationsEnabled) {
      navigate('/chatpage');
      // 알림을 끄는 로직
      setIsNotificationsEnabled(false);
    }
  };

  // 알림 표시를 위한 함수
  const notify = useCallback((message) => {
    if (isNotificationsEnabled) {
      toast(message, {
        onClick: handleToastClick, // 클릭 시 호출될 함수
        autoClose: 1000,
        hideProgressBar: true,
        newestOnTop: false,
        closeOnClick: true,
        pauseOnHover: true,
        limit: 1,
      });
    }
  }, [navigate, isNotificationsEnabled]);

  // 알림 설정을 변경하는 함수
  const toggleNotifications = () => {
    setIsNotificationsEnabled(prev => !prev);
  };

  return (
    <>
      <ToastContext.Provider value={{ notify, toggleNotifications, isNotificationsEnabled }}>
        {children}
        <ToastContainer
          position="bottom-right"
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={true}
          pauseOnHover={true}
          limit={1}
        />
      </ToastContext.Provider>

    </>
  );
};

export default ToastProvider;
