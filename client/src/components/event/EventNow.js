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
import { useEvents } from './EventContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Spinner from 'react-bootstrap/Spinner';

const EventNow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { events } = useEvents();

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // 현재 날짜 가져오기
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요

  // URL 쿼리에서 검색어를 읽어와 상태에 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  const handleCardClick = (id) => {
    navigate(`/event/detail/event/${id}`);
  };

  // 날짜 필터링
  const isOngoingEvent = (eventDate) => {
    const event = new Date(eventDate);
    const eventMonth = event.getMonth() + 1;
    return eventMonth === currentMonth;
  };
  
    // 데이터 로딩 완료 전 대기
    if (!events) {
      return (
        <div className="permissionMessage">
          <div>로딩중...
            <div>
              <Spinner animation="border" variant="dark" />
            </div>
          </div>
        </div>
      );
    }

    // 이벤트 데이터 추출
    const eventList = events.event;
    
    // 로그 추출용
    // console.log(" *eventList* " + eventList);
    // console.log(" >>>events<<< " + events);
    // console.log("Events Data:", JSON.stringify(events, null, 2));

    // 페이지네이션
    const filteredEvents = eventList
        .filter(event => isOngoingEvent(event.writeday) && (event.title.includes(searchQuery) || event.title2.includes(searchQuery)));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  console.log(currentEvents);
  return (
    <>
      <EventTop />
      {currentEvents.length > 0 ?
      (<div className="eventContent-container">
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
                  {event.thumbnail ? (
                    <CardCover className="card-cover">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          img: ({ node, ...props }) => <img {...props} className="card-photo" />
                        }}
                      >
                        {event.thumbnail}
                      </ReactMarkdown>
                      <div className="card-overlay-text">
                        {event.title2}
                      </div>
                    </CardCover>
                  ) : (
                    <CardCover className="card-cover">
                      <div className="title2-text">
                        {event.title2}
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
              <Box className="card-title2">
               <div className="nick-avature">
                  <Avatar
                    src={`https://images.unsplash.com/profile-${event.admin_id}?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff`}
                    size="sm"
                    sx={{ '--Avatar-size': '1.5rem' }}
                    className="card-avatar"
                  />
                  <div>
                    <div className="card-admin-name">
                      {event.admin_name}<a className='hidden'>{event.admin_id}</a>
                    </div>
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
      </div>) : (<div className="permissionMessage" >
          <p>진행중인 이벤트가 없습니다.😭<br/> 다음 기회를 노려보세요!</p>
        </div>)}
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

export default EventNow;
