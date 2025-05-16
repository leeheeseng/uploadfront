import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/NoticeList.scss';
import axios from 'axios';

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/notices`, {
          params: {
            page: currentPage,
            size: 5
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotices(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("공지사항을 불러오는 데 실패했습니다.", error);
      }
    };

    if (token) {
      fetchNotices();
    }
  }, [token, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="notice-list">
      <h2>공지사항</h2>
      <div className="notice-header">
        <span className="header-title">제목</span>
        <span className="header-date">작성일</span>
        <span className="header-views">조회수</span>
      </div>

      <ul className="notice-items">
        {notices.length === 0 ? (
          <li>공지사항이 없습니다.</li>
        ) : (
          notices.map(notice => (
            <li key={notice.id} className="notice-item">
              <Link to={`/mypage/notice/${notice.id}`} className="notice-title">
                {notice.title}
              </Link>
              <span className="notice-date">{notice.date}</span>
              <span className="notice-views">{notice.views}</span>
            </li>
          ))
        )}
      </ul>

      {totalPages > 1 && (
        <div className="pagination">
          <button className='perv' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
            이전
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={currentPage === index ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}

          <button className='next' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default NoticeList;
