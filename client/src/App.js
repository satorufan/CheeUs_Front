import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import './fonts/fonts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import Main from './components/main/Main';
import Header from './components/app/Header';
import Footer from './components/app/Footer';
import { PostProvider } from './components/dtboard/PostContext';
import { EventProvider } from './components/event/EventContext';
import { MagazineProvider } from './components/magazine/MagazineContext';
import { AuthProvider } from './components/login/OAuth';
import ToastProvider from './components/app/ToastProvider';

import Event from './components/event/Event';
import EventAll from './components/event/EventAll';
import EventNow from './components/event/EventNow';
import EventEnd from './components/event/EventEnd';
import EventDetail from './components/event/EventDetail';


const ChatPage = lazy(() => import('./components/chat/ChatPage'));
const NotFound = lazy(() => import('./components/app/NotFound'));
const Signup = lazy(() => import('./components/signup/Signup'));
const Login = lazy(() => import('./components/login/Login'));
const LoginCallback = lazy(() => import('./components/login/LoginCallback'));
const SignupCallback = lazy(() => import('./components/signup/SignupCallback'));
const Match = lazy(() => import('./components/match/Match'));
const MyProfilePage = lazy(() => import('./components/profile/MyProfilePage'));
const EditProfile = lazy(() => import('./components/profile/EditProfile'));
const UserProfilePage = lazy(() => import('./components/profile/UserProfilePage'));
const DTBoard = lazy(() => import('./components/dtboard/DTBoard'));
const DTBInputForm = lazy(() => import('./components/dtboard/DTBInputForm'));
const PostDetail = lazy(() => import('./components/dtboard/PostDetail'));
const PostModify = lazy(() => import('./components/dtboard/PostModify'));
const BoardPage = lazy(() => import('./components/board/BoardPage'));
const ShortForm = lazy(() => import('./components/shortform/ShortForm'));
const WriteShortForm = lazy(() => import('./components/shortform/WriteShortForm'));
const EditShortForm = lazy(() => import('./components/shortform/EditShortForm'));
const DetailShortForm = lazy(() => import('./components/shortform/DetailShortForm'));
const InputFrom = lazy(() => import('./components/toast/InputForm'));
const FreeBoard = lazy(() => import('./components/freeboard/FreeBoard'));
const DetailFreeBoard = lazy(() => import('./components/freeboard/DetailFreeBoard'));
const WriteFreeBoard = lazy(() => import('./components/freeboard/WriteFreeBoard'));
const EditFreeBoard = lazy(() => import('./components/freeboard/EditFreeBoard'));
const EventBoard = lazy(() => import('./components/eventboard/EventBoard'));
const DetailEventBoard = lazy(() => import('./components/eventboard/DetailEventBoard'));
const WriteEventBoard = lazy(() => import('./components/eventboard/WriteEventBoard'));
const EditEventBoard = lazy(() => import('./components/eventboard/EditEventBoard'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const Magazine = lazy(() => import('./components/magazine/Magazine'));
const PopUp = lazy(() => import('./components/magazine/PopUp'));
const Recipe = lazy(() => import('./components/magazine/Recipe'));
const Tmi = lazy(() => import('./components/magazine/Tmi'));
const Recommend = lazy(() => import('./components/magazine/Recommend'));
const MagazineDetail = lazy(() => import('./components/magazine/MagazineDetail'));

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Router>
        <PostProvider>
         <MagazineProvider>
          <EventProvider>
          <ToastProvider>
           <Header />
           <Suspense fallback={<div className="permissionMessage">
                      <div>로딩중...
                        <div>
                          <Spinner animation="border" variant="dark" />
                        </div>
                      </div>
                    </div>}>
            <Routes>
              <Route exact path="/" element={<Main />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signupcallback" element={<SignupCallback />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logincallback" element={<LoginCallback />} />
              <Route path="/mypage" element={<MyProfilePage />} />
              <Route path="/userprofile/:email" element={<UserProfilePage />} />
              <Route path="/mypage/Edit/:id" element={<EditProfile />} />
              <Route path="/main" element={<Main />} />
              <Route path="/match" element={<Match />} />
              <Route path="/dtboard" element={<DTBoard />} />
              <Route path="/dtboard/input" element={<DTBInputForm />} />
              <Route path="/dtboard/post/:id" element={<PostDetail />} />
              <Route path="/dtboard/postModify/:id" element={<PostModify />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/board/shortform" element={<ShortForm />} />
              <Route path="/board/shortform/detail/:id" element={<DetailShortForm />} />
              <Route path="/board/shortform/Write" element={<WriteShortForm />} />
              <Route path="/board/shortform/edit/:id" element={<EditShortForm />} />
              <Route path="/board/freeboard" element={<FreeBoard />} />
              <Route path="/board/freeboard/detail/:id" element={<DetailFreeBoard />} />
              <Route path="/board/freeboard/write" element={<WriteFreeBoard />} />
              <Route path="/board/freeboard/edit/:id" element={<EditFreeBoard />} />
              <Route path="/board/eventboard" element={<EventBoard />} />
              <Route path="/board/eventboard/detail/:id" element={<DetailEventBoard />} />
              <Route path="/board/eventboard/write" element={<WriteEventBoard />} />
              <Route path="/board/eventboard/edit/:id" element={<EditEventBoard />} />
              <Route path="/chatpage" element={<ChatPage />} />
              <Route path="/input" element={<InputFrom />} />
              <Route path="/magazine" element={<Magazine/>} />
              <Route path="/magazine/popup" element={<PopUp/>} />              
              <Route path="/magazine/recipe" element={<Recipe/>} />              
              <Route path="/magazine/tmi" element={<Tmi/>} />              
              <Route path="/magazine/Recommend" element={<Recommend/>} />              
              <Route path="/magazine/detail/:category/:id" element={<MagazineDetail />} />
              <Route path="/event" element={<Event/>} />              
              <Route path="/event/eventAll" element={<EventAll/>} />              
              <Route path="/event/eventNow" element={<EventNow/>} />              
              <Route path="/event/eventEnd" element={<EventEnd/>} />              
              <Route path="*" element={<NotFound/>} />
              <Route path="/event/detail/:category/:id" element={<EventDetail />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
	        <Footer />
          </Suspense>
          </ToastProvider>
	       </EventProvider>
	       </MagazineProvider>
        </PostProvider>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;