import React, { useState, useEffect } from 'react';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import defaultProductImage from '../../src/img/default-book.png';
import '../scss/newProductDisplayComponent.scss';

import { useCategory } from '../context/CategoryContext';
import { useCart } from '../context/CartContext';

// 컴포넌트명 변경: CategoryFilterProductDisplayComponent
function CategoryFilterProductDisplayComponent({
  products = [],
  displayMode = 'grid',
  selectedProducts = [],
  onProductSelect,
  showRank = false,
  topCategoryId = null,
  subcategoryId = null
}) {
  const [imageErrors, setImageErrors] = useState({});
  const { categories } = useCategory();
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!topCategoryId) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter(product => {
      if (!Array.isArray(product.tags)) return false;
      const hasTop = product.tags.includes(parseInt(topCategoryId, 10));
      const hasSub = subcategoryId ? product.tags.includes(parseInt(subcategoryId, 10)) : true;
      return hasTop && hasSub;
    });
    setFilteredProducts(filtered);
  }, [products, topCategoryId, subcategoryId]);

  const handleImageError = id => setImageErrors(prev => ({ ...prev, [id]: true }));

  const formatPrice = price =>
    typeof price === 'number' ? price.toLocaleString('ko-KR') + '원' : '가격 정보 없음';

  const formatDate = dateStr => {
    if (!dateStr) return '출판일 정보 없음';
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '출판일 정보 없음';
    }
  };

  const renderStars = rating => {
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return (
        <div className="product-list-container__review-stars">
          <span className="product-list-container__score-text">리뷰 정보 없음</span>
        </div>
      );
    }
    const stars = Array(Math.floor(rating)).fill(0);
    return (
      <div className="product-list-container__review-stars">
        {stars.map((_, i) => <FaStar key={i} className="filled" />)}
        <span className="product-list-container__score-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const getTagName = id => {
    const top = categories.find(c => c.id === id);
    if (top) return top.name;
    for (const cat of categories) {
      const sub = cat.subCategories?.find(sc => sc.id === id);
      if (sub) return sub.name;
    }
    return '알 수 없음';
  };

  const renderTags = tags => (
    <div className="product-list-container__tags">
      {tags?.slice(0, 3).map((tag, i) => (
        <span key={i} className="product-list-container__tag">
          {getTagName(tag)}
        </span>
      ))}
    </div>
  );

  const renderImage = product => (
    <div className="product-list-container__image-container">
      {showRank && <span className="product-list-container__rank-badge">#{filteredProducts.indexOf(product) + 1}</span>}
      <img
        src={!imageErrors[product.id] && product.cover ? product.cover : defaultProductImage}
        alt={product.title || '상품 이미지'}
        className="product-list-container__image"
        onError={() => handleImageError(product.id)}
        loading="lazy"
      />
    </div>
  );

  const renderGridItem = product => (
    <div key={product.bookId} className={`product-card ${selectedProducts.includes(product.bookId) ? 'selected' : ''}`}>
      <input
        type="checkbox"
        className="product-checkbox"
        checked={selectedProducts.includes(product.bookId)}
        onChange={e => onProductSelect && onProductSelect(product.bookId, e.target.checked)}
      />
      <Link to={`/detail/${product.bookId}`} className="product-link">
        {renderImage(product)}
        {renderTags(product.tags)}
        <h3 className="product-title" title={product.title}>{product.title || '상품명 정보 없음'}</h3>
        <div className="product-meta">
          <div className="product-info">{product.writer} · {product.publisher}</div>
          <div className="product-date">출판일: {formatDate(product.publicationDate)}</div>
          <div className="product-pricing">
            {product.discountRate > 0 && <span className="original-price">{formatPrice(product.price)}</span>}
            <span className="discounted-price">{formatPrice(Math.floor(product.price * (1 - (product.discountRate || 0) / 100)))}</span>
            {product.discountRate > 0 && <span className="discount-badge">{product.discountRate}%</span>}
          </div>
          {renderStars(product.rating)}
        </div>
      </Link>
    </div>
  );

  const renderListItem = product => (
    <div key={product.bookId} className={`products-item ${selectedProducts.includes(product.bookId) ? 'selected' : ''}`}>
      <input
        type="checkbox"
        className="product-checkbox"
        checked={selectedProducts.includes(product.bookId)}
        onChange={e => onProductSelect && onProductSelect(product.bookId, e.target.checked)}
      />
      <Link to={`/detail/${product.bookId}`} className="product-link">
        <div className="product-main">
          {renderImage(product)}
          <div className="product-details">
            {renderTags(product.tags)}
            <h3 className="product-title">{product.title}</h3>
            <div className="product-info">{product.writer} · {product.publisher}</div>
            <div className="product-publication-date">출판일: {formatDate(product.publicationDate)}</div>
            <div className="product-pricing">
              {product.discountRate > 0 && <span className="original-price">{formatPrice(product.price)}</span>}
              <span className="discounted-price">{formatPrice(Math.floor(product.price * (1 - (product.discountRate || 0) / 100)))}</span>
              {product.discountRate > 0 && <span className="discount-badge">{product.discountRate}%</span>}
            </div>
            {renderStars(product.rating)}
          </div>
        </div>
      </Link>
      <div className="product-actions">
        <button className="add-to-cart" onClick={() => addToCart(product)}>
          <FaShoppingCart /> 장바구니
        </button>
      </div>
    </div>
  );

  if (filteredProducts.length === 0) {
    return <div className="no-data"><p>표시할 상품이 없습니다.</p></div>;
  }

  return (
    <div className="product-list-container">
      {displayMode === 'grid' ? (
        <div className="products-grid">{filteredProducts.map(renderGridItem)}</div>
      ) : (
        <div className="products-list">{filteredProducts.map(renderListItem)}</div>
      )}
    </div>
  );
}

CategoryFilterProductDisplayComponent.propTypes = {
  products: PropTypes.array.isRequired,
  displayMode: PropTypes.oneOf(['grid', 'list']),
  selectedProducts: PropTypes.array,
  onProductSelect: PropTypes.func,
  showRank: PropTypes.bool,
  topCategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subcategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

CategoryFilterProductDisplayComponent.defaultProps = {
  displayMode: 'grid',
  selectedProducts: [],
  onProductSelect: null,
  showRank: false,
  topCategoryId: null,
  subcategoryId: null
};

export default CategoryFilterProductDisplayComponent;