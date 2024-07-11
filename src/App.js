import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './fonts/fonts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/main/Main';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
import Header from './components/app/Header';
import Footer from './components/app/Footer';
import MyProfilePage from './components/profile/MyProfilePage';
import UserProfilePage from './components/profile/UserProfilePage';
import Match from './components/match/Match';
import DTBoard from './components/dtboard/DTBoard';
import Board from './components/board/BoardPage';
import InputFrom from './components/board/InputForm';
import DTBInputForm from './components/dtboard/DTBInputForm';
import { PostProvider } from './components/dtboard/PostContext';

function App() {
  return (
    <div className="App">
      <Router>
        <PostProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyProfilePage />} />
            <Route path="/userprofile/:id" element={<UserProfilePage />} />
            <Route path="/main" element={<Main />} />
            <Route path="/match" element={<Match />} />
            <Route path="/dtboard" element={<DTBoard />} />
            <Route path="/dtboard/input" element={<DTBInputForm />} />
            <Route path="/board" element={<Board />} />
            <Route path="/input" element={<InputFrom />} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
          <Footer />
        </PostProvider>
      </Router>
    </div>
  );
}

export default App;
