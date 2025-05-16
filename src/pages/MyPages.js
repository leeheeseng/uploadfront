import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import MyPageLayout from '../component/mypage/MyPageLayout';
import NoticeList from '../component/mypage/NoticeList';
import NoticeDetail from '../component/mypage/NoticeDetail'; // 추가
import OrderList from '../component/mypage/OrderList';
import UserInfoEdit from '../component/mypage/UserInfoEdit';
import Footer from '../component/footer';

const MyPage = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[2] || 'notice';

  return (
    <div className="mypage-wrapper">
      
      <MyPageLayout activeMenu={path}>
        <Routes>
          <Route path="userinfo" element={<UserInfoEdit />} />
          <Route path="order" element={<OrderList />} />
          <Route path="notice" element={<NoticeList />} />
          <Route path="notice/:id" element={<NoticeDetail />} /> {/* 추가 */}
          <Route path="*" element={<NoticeList />} />
        </Routes>
      </MyPageLayout>
      
      <Footer />
    </div>
  );
};

export default MyPage;