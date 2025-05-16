import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../scss/detail.scss';
import defaultBookImg from '../img/default-book.png';

const BookDetail = () => {
  const { bookId } = useParams();
  const [bookData, setBookData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookResponse, reviewsResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/detail/${bookId}`),
        axios.get(`http://localhost:8080/api/detail/${bookId}/reviews`)
      ]);

      setBookData(bookResponse.data);
      setReviews(reviewsResponse.data.content);
      console.log("책 정보:", bookResponse.data);
      console.log("리뷰 정보:", reviewsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "데이터를 불러오는 데 실패했습니다.");
      console.error("API 요청 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);

  const handleAddReview = async () => {
    const memberId = localStorage.getItem("memberId");

    if (!memberId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    if (!newReview.trim() || newReview.trim().length < 10) {
      alert("리뷰는 10자 이상 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/detail/${bookId}/reviews`, {
        bookId: parseInt(bookId),
        memberId: parseInt(memberId),
        rating: rating,
        reviewText: newReview
      });

      setReviews((prevReviews) => [...prevReviews, response.data]);
      setNewReview('');
      setRating(3);
    } catch (err) {
      alert(err.response?.data?.message || "리뷰 등록에 실패했습니다.");
    }
  };

  const formatPrice = (price) => {
    return Math.floor(price)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  const handleImageError = (e) => {
    e.target.src = defaultBookImg;
    e.target.onerror = null;
  };

  const handleAddToCart = async () => {
    const memberId = localStorage.getItem("memberId");
    if (!memberId) {
      alert("로그인 후 이용해 주세요!");
      return;
    }

    try {
      const cartItem = {
        bookId: bookData.bookId,
        memberId: parseInt(memberId),
        quantity: 1
      };

      const response = await axios.post("http://localhost:8080/api/cart", cartItem);
      alert("장바구니에 추가되었습니다!");
      console.log("장바구니 추가 완료:", response.data);
    } catch (err) {
      console.error("장바구니 추가 실패:", err);
      alert(err.response?.data?.message || "장바구니 담기에 실패했습니다.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!bookData) return <div className="error">책 정보를 찾을 수 없습니다.</div>;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0)) / reviews.length
    : bookData.rating || 0;

  return (
    <div className="book-detail-container">
      <div className="book-detail-top">
        <section className="book-basic-section">
          <div className="book-header">
            <h1 className="book-title">{bookData.title}</h1>
            <div className="rating-badge">
              ★ {averageRating.toFixed(1)} ({reviews.length}개 리뷰)
            </div>
          </div>

          <div className="book-meta">
            <span className="author">{bookData.writer}</span>
            <span className="separator">, </span>
            <span className="publisher">{bookData.publisher}</span>
          </div>

          <div className="book-cover-container">
            <img
              src={bookData.cover
                ? bookData.cover
                : bookData.cover
                ? `data:image/jpeg;base64,${bookData.cover}`
                : defaultBookImg}
              alt="책 표지"
              className="book-cover"
              onError={handleImageError}
            />
          </div>
        </section>

        <section className="price-tag-section">
          <div className="price-info">
            {bookData.discountRate > 0 && (
              <span className="original-price">원가 {formatPrice(bookData.price)}원 </span>
            )}
            {bookData.discountRate > 0 && (
              <span className="discount-rate">{bookData.discountRate}%할인</span>
            )}
            <span className="discounted-price">
              할인가 {formatPrice(bookData.price * (100 - bookData.discountRate) / 100)}원
            </span>
          </div>

          <div className="button-group">
            <button className="cart-btn" onClick={handleAddToCart}>
              장바구니 담기
            </button>
          </div>
        </section>
      </div>

      <div className="book-detail-bottom">
        <section className="book-details-section">
          <h3 className="section-title">작가의 말</h3>
          <p className="author-note">
            {bookData.writersComment || '작가의 말이 없습니다.'}
          </p>

          <div className="detail-subsection">
            <h4 className="subsection-title">목차</h4>
            <div className="contents">
              {bookData.bookIndex ? (
                <pre>{bookData.bookIndex}</pre>
              ) : (
                <p>목차 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </section>

        <section className="review-section">
          <div className="review-header">
            <h3 className="section-title">리뷰 ({reviews.length})</h3>
            <div className="review-stats">
              <span>평균 ★ {averageRating.toFixed(1)}</span>
            </div>
          </div>

          <div className="review-form">
            <div className="rating-input">
              <span>평점: </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${star <= rating ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  aria-label={`${star}점 선택`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="리뷰를 작성해주세요 (최소 10자 이상)"
              rows="4"
              minLength="10"
            />
            <button
              onClick={handleAddReview}
              disabled={newReview.trim().length < 10}
            >
              리뷰 등록
            </button>
          </div>

          <div className="review-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.reviewId} className="review-item">
                  <div className="reviewer-info">
                    <div className="reviewer-meta">
                      <p className="reviewer-id">사용자 {review.memberId}</p>
                      <div className="review-rating">
                        {'★'.repeat(review.rating)}
                      </div>
                    </div>
                    <p className="review-date">
                      {new Date(review.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="review-content">{review.reviewText}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">이 책의 첫 리뷰를 작성해주세요!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookDetail;
