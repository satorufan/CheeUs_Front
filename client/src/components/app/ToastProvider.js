import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('isNotificationsEnabled');
    return saved === null ? true : JSON.parse(saved);
  });

  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
      
      if (!document.hidden) {
        toast.dismiss(); 
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isNotificationsEnabled', JSON.stringify(isNotificationsEnabled));
  }, [isNotificationsEnabled]);

  const handleToastClick = () => {
    if (isNotificationsEnabled) {
      navigate('/chatpage');
      setIsNotificationsEnabled(false);
    }
  };

  const notify = useCallback((message) => {
    if (isNotificationsEnabled && isPageVisible) {
      toast(message, {
        onClick: handleToastClick,
        autoClose: 1000,
        hideProgressBar: true,
        newestOnTop: false,
        closeOnClick: true,
        pauseOnHover: true,
        limit: 1,
      });
    }
  }, [navigate, isNotificationsEnabled, isPageVisible]);

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
