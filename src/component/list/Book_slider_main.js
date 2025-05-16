import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../scss/Book_slider_main.scss';
import defaultBookImg from '../../img/default-book.png'; // ✅ 기본 이미지 import

const Book_slider_main = ({ books = [] }) => {
  const carouselRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const navigate = useNavigate();

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

  const handleBookClick = (bookId) => {
    if (bookId) {
      navigate(`/detail/${bookId}`);
    }
  };

  const displayBooks = books.length > 0 ? books : Array(5).fill(null);

  return (
    <div className="book-slider-container">
      {showLeftButton && (
        <button className="slider-button left" onClick={() => scroll('left')}>
          &lt;
        </button>
      )}
      <h1>잘나가는 책</h1>
      <div className="slider-wrapper" ref={carouselRef} onScroll={handleScroll}>
        {displayBooks.map((book, index) => (
          <div
            className={`book-item ${book ? 'clickable' : ''}`}
            key={book ? book.bookId : `empty-${index}`}
            onClick={() => handleBookClick(book?.bookId)}
          >
            <div className="book-cover-container">
              {book ? (
                <img
                  src={book.cover && book.cover.trim() !== '' ? book.cover : defaultBookImg}
                  alt={`${book.title} 표지`}
                  className="book-cover"
                  onError={(e) => {
                    e.target.src = defaultBookImg;
                  }}
                />
              ) : (
                <div className="cover-placeholder empty">데이터 없음</div>
              )}
            </div>

            <div className="book-info">
              <div className="tag-section">
                {book ? (
                  book.tags?.slice(0, 2).map((tag, i) => (
                    <span className="book-tag" key={i}>{tag}</span>
                  ))
                ) : (
                  <span className="book-tag empty">데이터 없음</span>
                )}
              </div>

              <h3 className={`book-title ${!book ? 'empty' : ''}`}>
                {book ? book.title : '데이터 없음'}
              </h3>

              <p className={`book-meta ${!book ? 'empty' : ''}`}>
                {book ? `${book.writer} · ${book.publisher}` : '데이터 없음'}
              </p>

              <div className="price-section">
                {book ? (
                  <>
                    {book.discountRate > 0 && (
                      <span className="discount-rate">{book.discountRate}%</span>
                    )}
                    <span className="final-price">
                      {book.price?.toLocaleString()}원
                    </span>
                  </>
                ) : (
                  <span className="price-placeholder empty">데이터 없음</span>
                )}
              </div>

              <div className={`review-section ${!book ? 'empty' : ''}`}>
                {book ? `★ ${book.rating?.toFixed(1)}` : '데이터 없음'}
              </div>
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

export default Book_slider_main;
