// src/components/App.js
import { Routes, Route } from 'react-router-dom';
import withAuth from '../hoc/auth';
import NavBar from './views/NavBar/NavBar';
import Footer from './views/Footer/Footer';
import LandingPage from './views/LandingPage/LandingPage';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import MovieDetail from './views/MovieDetail/MovieDetail';

const LandingWithAuth = withAuth(LandingPage, null);  // 누구나 접근
const LoginWithAuth = withAuth(LoginPage, false);     // 로그인 안 한 사람만
const RegisterWithAuth = withAuth(RegisterPage, false);
const MovieDetailWithAuth = withAuth(MovieDetail, null); // 누구나 접근

export default function App() {
  return (
    <>
      <NavBar />
      {/* NavBar 높이만큼 여백을 주고, 푸터 공간도 확보 */}
      <div style={{ paddingTop: 64, minHeight: 'calc(100vh - 64px - 80px)' }}>
        <Routes>
          <Route path="/" element={<LandingWithAuth />} />
          <Route path="/login" element={<LoginWithAuth />} />
          <Route path="/register" element={<RegisterWithAuth />} />
          <Route path="/movie/:movieId" element={<MovieDetailWithAuth />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
