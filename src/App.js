import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import BoardPage from './components/board/BoardPage';
import ShortForm from './components/shortform/ShortFrom';
import InputFrom from './components/toast/InputForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyProfilePage />} />
          <Route path="/userprofile/:id" element={<UserProfilePage />} />
          <Route path="/main" element={<Main />} />
          <Route path="/match" element={<Match />} />
          <Route path="/dtboard" element={<DTBoard />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/board/shortform" element={<ShortForm />} />
          <Route path="/input" element={<InputFrom />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;