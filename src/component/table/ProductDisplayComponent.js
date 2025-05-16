import React, { useState, useEffect } from 'react';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import defaultProductImage from '../../../src/img/default-book.png';
import '../../scss/ProductDisplayComponent.scss';
import { useCategory } from '../../context/CategoryContext';
import { useCart } from '../../context/CartContext';

const ProductDisplayComponent = ({
  products = [],
  displayMode = 'grid',
  selectedProducts = [],
  onProductSelect,
  showRank = false, 
  topCategoryId = null,
  subcategoryId = null
}) => {
  const [imageErrors, setImageErrors] = useState({});
  const { categories } = useCategory();
  const { cart, addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!topCategoryId) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) => {
      if (!Array.isArray(product.tags)) return false;

      const hasTop = product.tags.includes(parseInt(topCategoryId));
      const hasSub = subcategoryId ? product.tags.includes(parseInt(subcategoryId)) : true;

      return hasTop && hasSub;
    });

    setFilteredProducts(filtered);
  }, [products, topCategoryId, subcategoryId]);

  const handleImageLoadError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') return '가격 정보 없음';
    return price.toLocaleString('ko-KR') + '원';
  };

  const formatPublicationDate = (dateString) => {
    if (!dateString) return '출판일 정보 없음';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return '출판일 정보 없음';
    }
  };

  const renderReviewStars = (rating) => {
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return <div className="review-stars"><span className="score-text">리뷰 정보 없음</span></div>;
    }
  
    const filledStars = Math.floor(rating);
    return (
      <div className="review-stars">
        {[...Array(filledStars)].map((_, index) => (
          <FaStar key={`filled-${index}`} className="filled" />
        ))}
        <span className="score-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const getTagName = (tagId) => {
    const top = categories.find(c => c.id === tagId);
    if (top) return top.name;
    for (const cat of categories) {
      const sub = cat.subCategories?.find(sc => sc.id === tagId);
      if (sub) return sub.name;
    }
    return '알 수 없음';
  };

  const renderTags = (tags) => (
    <div className="product-tags">
      {tags?.slice(0, 3).map((tag, index) => (
        <span key={index} className="product-tag">{getTagName(tag)}</span>
      ))}
    </div>
  );

  const renderProductImage = (product) => (
    <div className="book-image-container">
      {showRank && (
        <span className="product-rank-badge">#{products.indexOf(product) + 1}</span>
      )}
      <img
        src={product.cover && product.cover.trim() !== "" && !imageErrors[product.id]
          ? product.cover
          : defaultProductImage}
        alt={product.title || '상품 이미지'}
        className="book-image"
        loading="lazy"
        onError={() => handleImageLoadError(product.id)}
      />
    </div>
  );
 const renderlistProductImage = (product) => (
    <div className="product-image-container">
      {showRank && (
        <span className="product-rank-badge">#{products.indexOf(product) + 1}</span>
      )}
      <img
        src={product.cover && product.cover.trim() !== "" && !imageErrors[product.id]
          ? product.cover
          : defaultProductImage}
        alt={product.title || '상품 이미지'}
        className="product-image"
        loading="lazy"
        onError={() => handleImageLoadError(product.id)}
      />
    </div>
  );
  const renderProductName = (title) => {
    if (!title) return <span className="no-product-name">상품명 정보 없음</span>;
    return <h3 className="product-title" title={title}>{title}</h3>;
  };

  const renderProductPrice = (product) => {
    if (!product.price && product.discountRate === 0) {
      return <div className="no-price-info">가격 정보 없음</div>;
    }
    const discountedPrice = Math.floor(product.price * (1 - (product.discountRate || 0) / 100));
    return (
      <div className="product-pricing">
        <div className="discount-info">
          {product.discountRate > 0 && (
            <span className="original-price">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="discounted-price">
            {formatPrice(discountedPrice)}
          </span>
          {product.discountRate > 0 && (
            <span className="discount-badge">
              {product.discountRate}% 할인
            </span>
          )}
        </div>
      </div>
    );
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`'${product.title}'이(가) 장바구니에 추가되었습니다.`);
  };

  const renderGridItem = (product) => (
    <div
      key={`product-${product.bookId}`}
      className={`product-card ${selectedProducts.includes(product.bookId) ? 'selected' : ''}`} 
    >
      <input
        type="checkbox"
        className="select-checkbox"
        checked={selectedProducts.includes(product.bookId)}
        onChange={(e) => onProductSelect && onProductSelect(product.bookId, e.target.checked)}
      />
      <Link to={`/detail/${product.bookId}`} className="book-link">
        {renderProductImage(product)}
        {renderTags(product.tags)}
        {renderProductName(product.title)}
        <div className="book-meta">
          <div className="book-info">
            {product.writer} · {product.publisher}
          </div>
          <div className="book-date">
            출판일: {formatPublicationDate(product.publicationDate)}
          </div>
          {renderProductPrice(product)}
          {renderReviewStars(product.rating)}
        </div>
      </Link>
      <div className="product-sidebar">
        <div className="action-buttons">
          <button className="cart-button" onClick={() => handleAddToCart(product)}>
            <FaShoppingCart /> 장바구니
          </button>
        </div>
      </div>
    </div>
  );

  const renderListItem = (product) => (
    <div
      key={`product-${product.bookId}`}
      className={`product-item ${selectedProducts.includes(product.bookId) ? 'selected' : ''}`}
    >
      <input
        type="checkbox"
        className="select-checkbox"
        checked={selectedProducts.includes(product.bookId)}
        onChange={(e) => onProductSelect && onProductSelect(product.bookId, e.target.checked)}
      />
      <Link to={`/detail/${product.bookId}`} className="product-link">
        <div className="product-main">
          {renderlistProductImage(product)}
          <div className="product-details">
            {renderTags(product.tags)}
            {renderProductName(product.title)}
            <div className="product-info">
              {product.writer} · {product.publisher}
            </div>
            <div className="publication-date">
              출판일: {formatPublicationDate(product.publicationDate)}
            </div>
            {renderProductPrice(product)}
            {renderReviewStars(product.rating)}
          </div>
        </div>
      </Link>
      <div className="product-sidebar">
        <div className="action-buttons">
          <button className="cart-button" onClick={() => handleAddToCart(product)}>
            <FaShoppingCart /> 장바구니
          </button>
        </div>
      </div>
    </div>
  );

  if (filteredProducts.length === 0) {
    return <div className="no-products">표시할 상품이 없습니다.</div>;
  }

  return (
    <div>
      {displayMode === 'grid' ? (
        <div className="product-grid" role="list" aria-label="상품 목록">
          {filteredProducts.map(renderGridItem)}
        </div>
      ) : (
        <div className="product-list" role="list" aria-label="상품 목록">
          {filteredProducts.map(renderListItem)}
        </div>
      )}
    </div>
  );
};

ProductDisplayComponent.propTypes = {
  products: PropTypes.array.isRequired,
  displayMode: PropTypes.string,
  selectedProducts: PropTypes.array,
  onProductSelect: PropTypes.func,
  showRank: PropTypes.bool,
  topCategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subcategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ProductDisplayComponent.defaultProps = {
  displayMode: 'grid',
  selectedProducts: [],
  onProductSelect: null,
  showRank: false,
  topCategoryId: null,
  subcategoryId: null
};

export default ProductDisplayComponent;