import './App.css';
import { BrowserRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/main/Main';
import Login from './components/login/Login';
import Profile from './components/profile/profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/main" element={<Main />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;