import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import EventTop from "./EventTop";
import Pagination from '@mui/material/Pagination';
import './Event.css';

const initialEvents = [
  {
    id: 1,
    title: "CHEE US 6월 이벤트!",
    content: "6월 이벤트!",
    photoes: "/images/event6.jpg",
    admin_id: 1,
    author_name: "관리자",
    like: 17,
    views: 151,
    category: 'event'
  },
  {
    id: 2,
    title: "CHEE US 7월 이벤트!",
    content: "7월 이벤트!",
    photoes: "/images/event7.jpg",
    admin_id: 2,
    author_name: "관리자",
    like: 21,
    views: 78,
    category: 'event'
  },
  {
    id: 3,
    title: "CHEE US 8월 이벤트!",
    content: "8월 이벤트!",
    photoes: "/images/event8.jpg",
    admin_id: 2,
    author_name: "관리자",
    like: 5,
    views: 37,
    category: 'event'
  },
  {
    id: 4,
    title: "CHEE US 9월 이벤트!",
    content: "9월 이벤트!",
    photoes: "/images/event9.jpg",
    admin_id: 2,
    author_name: "관리자",
    like: 34,
    views: 97,
    category: 'event'
  },
  {
    id: 5,
    title: "CHEE US 10월 이벤트!",
    content: "10월 이벤트!",
    photoes: "/images/event10.jpg",
    admin_id: 2,
    author_name: "관리자",
    like: 55,
    views: 138,
    category: 'event'
  },
  {
    id: 6,
    title: "CHEE US 11월 이벤트!",
    content: "11월의 이벤트!",
    photoes: "/images/event11.jpg",
    admin_id: 2,
    author_name: "관리자",
    like: 55,
    views: 138,
    category: 'event'
  },
  {
    id: 7,
    title: "CHEE US 12월 이벤트!",
    content: "12월의 이벤트!",
    photoes: "/images/event12.jpg",
    admin_id: 2,
    author_name: "관리자",
    like: 55,
    views: 138,
    category: 'event'
  },
];

const EventAll = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState(initialEvents); // 초기화 시 dummyData 사용
  const [searchQuery, setSearchQuery] = useState('');

  // URL 쿼리에서 검색어를 읽어와 상태에 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  const handleCardClick = (id) => {
    navigate(`/event/detail/event/${id}`);
  };

  // 페이지네이션
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = events.filter(event => event.category === 'event' && (event.title.includes(searchQuery) || event.content.includes(searchQuery))).slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(events.filter(event => event.category === 'event' && (event.title.includes(searchQuery) || event.content.includes(searchQuery))).length / itemsPerPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <EventTop/>
      <div className="eventContent-container">
        <div className="eventContent-card-container">
          {currentEvents.map((event) => (
            <Card
              key={event.id}
              variant="plain"
              className="eventContent-card"
              onClick={() => handleCardClick(event.id)}
            >
              <Box className="card-video">
                <AspectRatio ratio="4/3">
                  {event.photoes ? (
                    <CardCover className="card-cover">
                      <img
                        src={event.photoes}
                        alt="게시물 사진"
                        className="card-photo"
                      />
                      <div className="card-overlay-text">
                        {event.content}
                      </div>
                    </CardCover>
                  ) : (
                    <CardCover className="card-cover">
                      <div className="content-text">
                        {event.content}
                      </div>
                    </CardCover>
                  )}
                </AspectRatio>
              </Box>
              <Box>
                <div className="eventContent-title">
                  {event.title}
                </div>
              </Box>
              <Box className="card-content">
                <Avatar
                  src={`https://images.unsplash.com/profile-${event.admin_id}?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff`}
                  size="sm"
                  sx={{ '--Avatar-size': '1.5rem' }}
                  className="card-avatar"
                />
                <div>
                  <div className="card-author-name">
                    {event.author_name}<a className ='hidden'>{event.admin_id}</a>
                  </div>
                </div>
                <div className="card-icons-container">
                  <div className="card-icon">
                    <Favorite color="action" />
                    {event.like}
                  </div>
                  <div className="card-icon">
                    <Visibility />
                    {event.views}
                  </div>
                </div>
              </Box>
            </Card>
          ))}
        </div>
      </div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'black',
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'black',
            color: 'white',
          },
          '& .MuiPaginationItem-root:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
        className="pagination"
      />
    </>
  );
};

export default EventAll;
