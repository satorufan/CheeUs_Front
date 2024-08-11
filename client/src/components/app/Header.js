import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { AuthContext } from '../login/OAuth';
import './header.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, selectProfileStatus, selectUserProfile } from '../../store/ProfileSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAllUnreadStatus } from '../../store/ChatSlice';
import useSocketIo from '../../hooks/useSocketIo';

const Header = React.memo(function Header() {
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(() => {
        // localStorage에서 값을 불러와 초기 상태를 설정합니다.
        const storedUnreadStatus = localStorage.getItem('hasUnreadMessages');
        return storedUnreadStatus ? JSON.parse(storedUnreadStatus) : false;
    });

    const { token, serverUrl, requestSignOut, memberEmail } = useContext(AuthContext);
    const userProfile = useSelector(selectUserProfile);
    const profileStatus = useSelector(selectProfileStatus);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // useSocketIo 훅에서 읽지 않은 메시지 상태를 업데이트
    useSocketIo('one', null, memberEmail, setHasUnreadMessages);

    const defaultProfileImage = `${process.env.PUBLIC_URL}/images/default-avatar.jpg`;

    // 토큰이 있을 때 사용자 프로필을 가져옵니다.
    useEffect(() => {
        if (token) {
            dispatch(fetchUserProfile({ serverUrl, memberEmail, token }));
        }
    }, [token, dispatch, serverUrl, memberEmail]);

    // 읽지 않은 메시지 상태를 로컬 스토리지에 저장합니다.
    useEffect(() => {
        console.log('Saving hasUnreadMessages to localStorage:', hasUnreadMessages);
        localStorage.setItem('hasUnreadMessages', JSON.stringify(hasUnreadMessages));
    }, [hasUnreadMessages]);

    // 사용자 프로필 이미지 처리
    useEffect(() => {
        if (userProfile && userProfile.imageBlob && userProfile.imageBlob.length > 0) {
            localStorage.setItem('profileImage', userProfile.imageBlob[0]);
        }
    }, [userProfile]);

    const storedImage = localStorage.getItem('profileImage');
    const profileImage = useMemo(() => {
        if (storedImage) {
            return storedImage;
        }
        return userProfile && userProfile.imageBlob && userProfile.imageBlob.length > 0
            ? userProfile.imageBlob[0]
            : defaultProfileImage;
    }, [storedImage, userProfile]);

    const handleLogout = useCallback(() => {
        requestSignOut();
    }, [requestSignOut]);

    const handleNavToggle = useCallback(() => {
        setIsNavExpanded(prev => !prev);
    }, []);

    const handleLinkClick = useCallback((e) => {
        e.preventDefault();
        navigate('/dtboard');
        window.location.reload();
    }, [navigate]);

    const handleChatLinkClick = useCallback(() => {
        console.log('Clearing unread messages status');
        dispatch(clearAllUnreadStatus()); 
        setHasUnreadMessages(false); 
        localStorage.setItem('hasUnreadMessages', JSON.stringify(false)); // 상태를 클리어 하기 위해 로컬 스토리지에 저장
    }, [dispatch]);

    // 관리 페이지로 시작하는 경로에서는 헤더를 표시하지 않습니다.
    if (location.pathname.startsWith("/admin")) {
        return null;
    }

    const isLoggedIn = memberEmail !== '';

    return (
        <div className="header-container">
            <Navbar bg="#f2d420" expand="lg" style={{ backgroundColor: 'white' }} expanded={isNavExpanded}>
                <Container fluid className="header-box">
                    <Navbar.Brand href="/main" className="header-logo">
                        <img
                            src={process.env.PUBLIC_URL + '/images/whitelogo.png'}
                            height="70"
                            className="d-inline-block align-top"
                            alt="Navbar Logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarNav" onClick={handleNavToggle} />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/match" className="nav-link-list">둘이 마셔요</Nav.Link>
                            <Nav.Link href="/dtboard" className="nav-link-list" onClick={handleLinkClick}>함께 마셔요</Nav.Link>
                            <Nav.Link href="/board" className="nav-link-list">게시판</Nav.Link>
                            <Nav.Link href="/event" className="nav-link-list">이벤트</Nav.Link>
                            <Nav.Link href="/magazine" className="nav-link-list">매거진</Nav.Link>

                            {isLoggedIn ? (
                                <>
                                    <Nav.Link href="/mypage" className="nav-link-list">
                                        {isNavExpanded ? (
                                            "프로필"
                                        ) : (
                                            <Stack direction="row" alignItems="center">
                                                <Avatar
                                                    alt="User Avatar"
                                                    src={profileImage}
                                                    sx={{ width: 32, height: 32 }}
                                                />
                                            </Stack>
                                        )}
                                    </Nav.Link>
                                    <Nav.Link href="/chatpage" className="nav-link-list" onClick={handleChatLinkClick}>
                                        {isNavExpanded ? (
                                            "채팅방"
                                        ) : (
                                            <Box sx={{ color: 'action.active' }}>
                                                <Badge color="warning" variant={hasUnreadMessages ? 'dot' : 'standard'}>
                                                    <MailIcon />
                                                </Badge>
                                            </Box>
                                        )}
                                    </Nav.Link>
                                    <Nav.Link onClick={handleLogout}>
                                        {isNavExpanded ? (
                                            "Log-Out"
                                        ) : (
                                            <button type="button" className="btn btn-light header-logout-btn">Log-Out</button>
                                        )}
                                    </Nav.Link>
                                </>
                            ) : (
                                <Nav.Link href="/login">
                                    {isNavExpanded ? (
                                        "Log-In"
                                    ) : profileStatus === "loading" ? <></> : (
                                        <button type="button" className="btn btn-light header-login-btn">Log-In</button>
                                    )}
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
});

export default Header;
