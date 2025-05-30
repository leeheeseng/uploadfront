import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../scss/eventDetail.scss";
import defaultBookImg from '../img/default-book.png';

const EventDetail = () => {
    const { id } = useParams(); // URL에서 id 파라미터 받기
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 사용
    const [event, setEvent] = useState(null); // 이벤트 상태 저장

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events/${id}`);
                console.log("받아온 이벤트 데이터:", response.data); // 받아온 데이터 콘솔에 출력
                setEvent(response.data); // API로부터 데이터를 받아서 상태 업데이트
            } catch (error) {
                console.error("이벤트 상세 데이터를 불러오는 중 에러 발생:", error);
            }
        };

        fetchEventDetails(); // 컴포넌트가 마운트될 때 API 호출
    }, [id]);

    if (!event) return <div className="loading">Loading...</div>; // 로딩 화면 표시

    // 날짜 포맷팅 함수
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
    };

    return (
        <div className="event-detail-container">
            <h1 className="event-title">{event.title}</h1>
            <div className="event-header">
                <img
                    src={event.cover || defaultBookImg}
                    alt={event.title}
                    className="event-main-image"
                    onError={(e) => { e.target.src = defaultBookImg; }}
                />
                <div className="event-meta">
                    <span className={`event-status ${event.discountRate > 0 ? 'ongoing' : 'ended'}`}>
                        {event.discountRate > 0 ? '진행중' : '종료'}
                    </span>
                    <p className="event-period">
                        {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
                    </p>
                </div>
            </div>
            <div className="event-content">
                <h2>이벤트 상세 내용</h2>
                <p>{event.eventDetail?.eventDetail || '상세 내용이 없습니다.'}</p>
            </div>
            <button 
                className="back-button"
                onClick={() => navigate('/events')} // 이벤트 목록 페이지로 돌아가기
            >
                이벤트 목록
            </button>
        </div>
    );
};

export default EventDetail;
