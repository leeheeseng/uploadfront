import React, { useEffect, useState } from 'react';
import './styles/MyPageLayout.scss';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyPageLayout = ({ children, activeMenu }) => {
  const [profileData, setProfileData] = useState({ name: '' });
  const navigate = useNavigate();
  const memberId = sessionStorage.getItem("memberId");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!memberId || !token) {
      alert('로그인이 필요합니다.');
      navigate('/login');  // 로그인 페이지 경로로 이동
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/member/info`, {
          params: { memberId },
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error("회원 정보 불러오기 실패:", error);
      }
    };

    fetchUserInfo();
  }, [memberId, token, navigate]);

  const menus = [
    { id: 'notice', name: '공지사항', path: '/mypage/notice' },
    { id: 'order', name: '주문 조회', path: '/mypage/order' },
    { id: 'userInfo', name: '회원정보 수정', path: '/mypage/userinfo' }
  ];

  return (
    <div className="mypage-container">
      <div className="sidebar">
        <div className="profile-card">
          <div className="profile-image"></div>
          <div className="profile-info">
            <h2 className="user-name">{profileData.name || "닉네임"}님의 마이페이지</h2>
          </div>
        </div>

        <nav className="sidebar-menu">
          <ul>
            {menus.map(menu => (
              <li 
                key={menu.id} 
                className={activeMenu === menu.id ? 'active' : ''}
              >
                <Link to={menu.path}>{menu.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default MyPageLayout;
