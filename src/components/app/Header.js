import React, { useContext, useEffect, useState } from 'react';
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
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Header() {
    const [isUnread, setIsUnread] = useState(true); // 채팅 읽지 않은 상태
    const { token, serverUrl, requestSignOut } = useContext(AuthContext);
    const [isNavExpanded, setIsNavExpanded] = useState(false); // Navbar 확장 상태 확인

    const userProfile = useSelector(selectUserProfile); // Redux에서 사용자 프로필 가져오기
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            const memberEmail = jwtDecode(token).email;
            dispatch(fetchUserProfile({ serverUrl, memberEmail }));
        }
    }, [token, dispatch, serverUrl]);

    const handleLogout = () => {
        requestSignOut();
    };

    const handleReadMessage = () => {
        setIsUnread(false);
    };

    const handleNavToggle = () => {
        setIsNavExpanded(!isNavExpanded);
    };
   const navigate = useNavigate();
   const handleLinkClick = (e) => {
     e.preventDefault();
     navigate('/dtboard');
     window.location.reload();
   };

    const isLoggedIn = userProfile !== null;

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
                            <Nav.Link href="/match">둘이 마셔요</Nav.Link>
                            <Nav.Link href="/dtboard" onClick = {handleLinkClick}>함께 마셔요</Nav.Link>
                            <Nav.Link href="/board">게시판</Nav.Link>
                            <Nav.Link href="/event">이벤트</Nav.Link>
                            <Nav.Link href="/magazine">메거진</Nav.Link>

                            {isLoggedIn ? (
                                <>
                                    <Nav.Link href="/mypage">
                                        {isNavExpanded ? (
                                            "프로필"
                                        ) : (
                                            <Stack direction="row" alignItems="center">
                                                <Avatar
                                                    alt="User Avatar"
                                                    src={userProfile && typeof userProfile.photo === 'string' ? userProfile.photo : `${process.env.PUBLIC_URL}/images/default-avatar.jpg`}
                                                    sx={{ width: 32, height: 32 }}
                                                />
                                            </Stack>
                                        )}
                                    </Nav.Link>
                                    <Nav.Link onClick={handleReadMessage} href="/chatpage">
                                        {isNavExpanded ? (
                                            "채팅방"
                                        ) : (
                                            <Box sx={{ color: 'action.active' }}>
                                                <Badge color="warning" variant={isUnread ? 'dot' : 'standard'}>
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
                                    ) : (
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
}

export default Header;
