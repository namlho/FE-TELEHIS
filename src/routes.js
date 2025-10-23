import { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Loading from './components/common/Loading';
import MainAppRoutes from './routes/MainAppRoutes';

import Home from './components/Home/Home';
// import Home from './components/home/Home';
// Kiểm tra xem người dùng đã đăng nhập chưa


function RouteApp() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Nếu người dùng vào "/" => Chuyển hướng đến "/home" với HashRouter */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Route Login */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Route Home - Sử dụng HashRouter */}
        <Route path="/" element={<><Home /></>} />

        {/* Các route chính của ứng dụng */}
        <Route path="*" element={<> <MainAppRoutes /> </>} />
      </Routes>
    </Suspense>
  );
}

export default RouteApp;
