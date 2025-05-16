import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './styles/NoticeDetail.scss';
import axios from 'axios';

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/notices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotice(response.data);
      } catch (error) {
        console.error("공지사항을 불러오는 데 실패했습니다.", error);
      }
    };

    if (id && token) {
      fetchNotice();
    }
  }, [id, token]);

  if (!notice) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="notice-detail">
      <div className="notice-header">
        <h2 className="notice-title">{notice.title}</h2>
        <div className="notice-meta">
          <span>작성자: {notice.author}</span>
          <span>작성일: {notice.date}</span>
          <span>조회수: {notice.views}</span>
        </div>
      </div>

      <div className="notice-content" dangerouslySetInnerHTML={{ __html: notice.content }} />

      <div className="notice-footer">
        <Link to="/mypage/notice" className="list-button">목록으로</Link>
      </div>
    </div>
  );
};

export default NoticeDetail;
