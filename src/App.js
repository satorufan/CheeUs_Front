import './App.css';
import { BrowserRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import './fonts/fonts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/main/Main';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
import Header from './components/app/Header';
import Footer from './components/app/Footer';
import MyProfilePage from './components/profile/MyProfilePage';
import Match from './components/match/Match';
import DTBoard from './components/dtboard/DTBoard';
import InputFrom from './components/board/InputForm';

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
          <Route path="/main" element={<Main />} />
          <Route path="/match" element={<Match />} />

          <Route path="/dtboard" element={<DTBoard />} />
          <Route path="/input" element={<InputFrom />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;