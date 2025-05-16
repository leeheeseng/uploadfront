import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../scss/Event_Slider_Main.scss';
import defaultBookImg from '../../img/default-book.png';

const Event_slider_main = ({ events = [] }) => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  };

  const isEventOngoing = (start, end) => {
    const today = new Date();
    if (new Date(start) <= today && today <= new Date(end)) {
      return 'ongoing';  // 진행중
    }
    if (new Date(end).toDateString() === today.toDateString()) {
      return 'ending-soon';  // 종료 임박
    }
    return 'ended';  // 종료
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const displayEvents = events.length > 0 ? events : Array(5).fill(null);

  return (
    <div className="event-slider-container">
      {showLeftButton && (
        <button className="slider-button left" onClick={() => scroll('left')}>
          &lt;
        </button>
      )}
      <h1>진행중인이벤트</h1>
      <div className="slider-wrapper" ref={carouselRef} onScroll={handleScroll}>
        {displayEvents.map((event, index) => (
          <div
            className="event-item"
            key={event ? event.eventId : `empty-${index}`}
            onClick={() => event && handleEventClick(event.eventId)}
            style={{ cursor: event ? 'pointer' : 'default' }}
          >
            <div className="event-cover-container">
              {event ? (
                <img
                  src={event.cover || defaultBookImg}
                  alt={`${event.title} 표지`}
                  className="event-cover"
                  onError={(e) => { e.target.src = defaultBookImg; }}
                />
              ) : (
                <div className="cover-placeholder empty">이미지 없음</div>
              )}
            </div>

            <div className="event-info">
              <h3 className={`event-title ${!event ? 'empty' : ''}`}>
                {event ? event.title : '이벤트 없음'}
              </h3>
              <p className={`event-period ${!event ? 'empty' : ''}`}>
                {event
                  ? `${formatDate(event.startDate)} ~ ${formatDate(event.endDate)}`
                  : '기간 정보 없음'}
              </p>
              {event && (
                <span className={`event-status ${isEventOngoing(event.startDate, event.endDate)}`}>
                  {isEventOngoing(event.startDate, event.endDate) === 'ongoing' 
                    ? '진행중' 
                    : isEventOngoing(event.startDate, event.endDate) === 'ending-soon' 
                    ? '종료 임박' 
                    : '종료'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showRightButton && (
        <button className="slider-button right" onClick={() => scroll('right')}>
          &gt;
        </button>
      )}
    </div>
  );
};

export default Event_slider_main;
