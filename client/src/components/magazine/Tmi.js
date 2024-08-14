import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import MagazineTop from "./MagazineTop";
import Pagination from '@mui/material/Pagination';
import './Magazine.css';
import { useMagazines } from './MagazineContext';
import Spinner from 'react-bootstrap/Spinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';


const Tmi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {magazines} = useMagazines();
  
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // URL 쿼리에서 검색어를 읽어와 상태에 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  const handleCardClick = (id) => {
	const magazineData = magazines.magazine.find(magazine=>magazine.id === id);    
    navigate(`/magazine/detail/tmi/${id}`,{state: {magazineData}});
  };

    // 데이터 로딩 완료 전 대기
    if (!magazines) {
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
    const magazineList = magazines.magazine;

    // 디버깅용
    // console.log("<<magazines.magazine>>JSON ", JSON.stringify(magazines, null, 2));

    // "tmi" 카테고리의 JSON만 필터링
    const filteredMagazines = magazineList
        .filter(magazine => magazine.category === 'tmi' &&
            (magazine.title.includes(searchQuery) || magazine.title2.includes(searchQuery)));

    // 페이지네이션
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentMagazines = filteredMagazines.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredMagazines.length / itemsPerPage);

    const handleChange = (event, value) => {
        setCurrentPage(value);
    };

  return (
    <>
      <MagazineTop/>
      <div className="magazineContent-container">
        <div className="magazineContent-card-container">
          {currentMagazines.map((magazine) => (
            <Card
              key={magazine.id}
              variant="plain"
              className="magazineContent-card"
              onClick={() => handleCardClick(magazine.id)}
            >
              <Box className="card-video">
                <AspectRatio ratio="4/3">
                  {magazine.thumbnail? (
                    <CardCover className="card-cover">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          img: ({ node, ...props }) => <img {...props} className="card-photo" />
                        }}
                      >
                        {magazine.thumbnail}
                      </ReactMarkdown>
                      <div className="card-overlay-text">
                        {magazine.title2}
                      </div>
                    </CardCover>
                  ) : (
                    <CardCover className="card-cover">
                      <div className="title2-text">
                        {magazine.title2}
                      </div>
                    </CardCover>
                  )}
                </AspectRatio>
              </Box>
              <Box>
                <div className="magazineContent-title">
                  {magazine.title}
                </div>
              </Box>
              <Box className="card-title2">
                <div className="nick-avature">
                  <Avatar
                    src={`https://images.unsplash.com/profile-${magazine.admin_id}?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff`}
                    size="sm"
                    sx={{ '--Avatar-size': '1.5rem' }}
                    className="card-avatar"
                  />
                  <div>
                    <div className="card-admin-name">
                      {magazine.admin_name}<a className = 'hidden'>{magazine.admin_id}</a>
                    </div>
                  </div>
                </div>
                <div className="card-icons-container">
                  <div className="card-icon">
                    <Favorite color="action" />
                    {magazine.like}
                  </div>
                  <div className="card-icon">
                    <Visibility />
                    {magazine.views}
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

export default Tmi;
