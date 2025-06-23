import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../scss/event.scss";
import defaultBookImage from "../../src/img/default-book.png";

const EventPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 12;
    const categories = ['전체', '진행중', '종료임박', '종료됨', '예정'];
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events`, {
                    params: {
                        page: 0,
                        size: 1000
                    }
                });
                setEvents(response.data.content);
                setApiError(false);
            } catch (error) {
                console.error("이벤트 데이터 로드 실패:", error);
                setApiError(true);
            }
        };
        fetchEvents();
    }, []);

    const handleEventClick = (event) => {
        const eventId = event.eventId || event.id || event._id;
        if (eventId) {
            navigate(`/events/${eventId}`);
        } else {
            console.error("이벤트 ID를 찾을 수 없습니다:", event);
        }
    };

    const handleSliderClick = () => {
        if (filteredEvents.length > 0 && filteredEvents[currentSlide]) {
            handleEventClick(filteredEvents[currentSlide]);
        }
    };

    const handleCardClick = (event) => {
        return () => handleEventClick(event);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % filteredEvents.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setCurrentSlide(0);
    };

    const filteredEvents = selectedCategory === '전체'
        ? events
        : events.filter(event => {
            const now = new Date();
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);

            switch (selectedCategory) {
                case '진행중':
                    return start <= now && now <= end;
                case '종료임박':
                    const threeDaysLater = new Date();
                    threeDaysLater.setDate(now.getDate() + 3);
                    return now <= end && end <= threeDaysLater;
                case '종료됨':
                    return end < now;
                case '예정':
                    return start > now;
                default:
                    return true;
            }
        });

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const pageGroupSize = 5;
    const currentGroup = Math.ceil(currentPage / pageGroupSize);
    const startPage = (currentGroup - 1) * pageGroupSize + 1;
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
    const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);

    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    );

    return (
        <div className="event-container">
            <h1 className="event-title">이벤트</h1>

            {apiError && (
                <div className="error-message">
                    <p>이벤트 데이터를 불러오는 데 문제가 발생했습니다. 최대한 빨리 고치겠습니다.</p>
                </div>
            )}

            <div className="main-slider">
                {filteredEvents.length > 0 && (
                    <div className="slider-item" onClick={handleSliderClick}>
                        <img
                            src={filteredEvents[currentSlide].cover || defaultBookImage}
                            alt={filteredEvents[currentSlide].title}
                            className="main-slider-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultBookImage;
                            }}
                        />
                        <div className="slider-overlay">
                            <h3 className="slider-title">{filteredEvents[currentSlide].title}</h3>
                            <p className="slider-date">{filteredEvents[currentSlide].startDate} ~ {filteredEvents[currentSlide].endDate}</p>
                        </div>
                        <div className="slider-buttons">
                            <button className="prev-button" onClick={(e) => { e.stopPropagation(); prevSlide(); }}>◀</button>
                            <button className="next-button" onClick={(e) => { e.stopPropagation(); nextSlide(); }}>▶</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="category-filter">
                <div className="category-tabs">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategorySelect(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="event-grid">
                {paginatedEvents.map((event) => (
                    <div
                        className="event-card"
                        key={event.eventId || event.id || event._id}
                        onClick={handleCardClick(event)}
                    >
                        <div className="event-cover">
                            <img
                                src={event.cover || defaultBookImage}
                                alt={event.title}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultBookImage;
                                }}
                            />
                            <span className="event-badge">{event.category}</span>
                        </div>
                        <ul className="event-info">
                            <li className="event-title">{event.title}</li>
                            <li className="event-date">{event.startDate} ~ {event.endDate}</li>
                        </ul>
                    </div>
                ))}
            </div>

            <div className="page-navigation">
                {totalPages > 1 && (
                    <>
                        <button
                            className="page-button prev"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            ◀
                        </button>

                        {visiblePageNumbers.map(number => (
                            <button
                                key={number}
                                className={`page-button ${currentPage === number ? 'active' : ''}`}
                                onClick={() => setCurrentPage(number)}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            className="page-button next"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            ▶
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventPage;
