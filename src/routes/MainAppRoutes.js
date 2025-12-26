import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import LayoutApp from "../components/layout/Layout";
import Loading from "../components/common/Loading";

const Home = lazy(() => import("../components/Home/Home"));
// const AddSupplier = lazy(() => import("../components/Suppliers/AddSupplier"));

// Các dịch vụ cận lâm sàng (có thể tạo component riêng cho từng dịch vụ nếu muốn)
const XetNghiem = lazy(() => import("../components/CanLamSang/XetNghiem"));
const SieuAm = lazy(() => import("../components/CanLamSang/SieuAm"));
const NoiSoi = lazy(() => import("../components/CanLamSang/NoiSoi/NoiSoi.jsx"));
const XQuang = lazy(() => import("../components/CanLamSang/XQuang"));
const CT = lazy(() => import("../components/CanLamSang/CT"));
const MRI = lazy(() => import("../components/CanLamSang/MRI"));
const ECG = lazy(() => import("../components/CanLamSang/ECG/ECG.jsx"));
const ThuThuat = lazy(() => import("../components/CanLamSang/ThuThuat"));
const PhauThuat = lazy(() => import("../components/CanLamSang/PhauThuat"));
const SuongKhop = lazy(() => import("../components/CanLamSang/XuongKhop/XuongKhop.jsx"));

const AdminUsers = lazy(() => import("../components/Admin/AdminUsers"));

function MainAppRoutes() {
  return (
    <LayoutApp>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/home" element={<Home />} /> */}

          {/* Cận lâm sàng */}
          <Route path="/canlam" element={<NoiSoi />} />
          <Route path="/canlam/xetnghiem" element={<XetNghiem />} />
          <Route path="/canlam/sieuam" element={<SieuAm />} />
          <Route path="/canlam/noisoi" element={<NoiSoi />} />
          <Route path="/canlam/xquang" element={<XQuang />} />
          <Route path="/canlam/ct" element={<CT />} />
          <Route path="/canlam/mri" element={<MRI />} />
          <Route path="/canlam/ecg" element={<ECG />} />
          <Route path="/canlam/thuthuat" element={<ThuThuat />} />
          <Route path="/canlam/phauthuat" element={<PhauThuat />} />
          <Route path="/canlam/xuongkhop" element={<SuongKhop />} />

          {/* Quản trị */}
          <Route path="/admin/users" element={<AdminUsers />} />

          {/* Route 404 hoặc catch-all */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </LayoutApp>
  );
}

export default MainAppRoutes;