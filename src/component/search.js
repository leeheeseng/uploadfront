import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductDisplayComponent from './newProductDisplayComponent';
import '../scss/CategoryFilterList.scss';

const SearchProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [displayMode, setDisplayMode] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // URLSearchParams를 사용하여 쿼리 파라미터 추출
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query') || '';
  const type = searchParams.get('type') || 'title'; // 기본값은 'title'로 설정

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 쿼리 파라미터가 title인지 author인지에 따라 적절한 파라미터 전달
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/detail/search`, {
          params: {
            [type]: query, // 'type'에 따라 'title' 또는 다른 필터 사용
            page: Math.max(0, currentPage - 1),
            size: itemsPerPage,
          },
        });

        const validatedProducts = response.data.content?.map((product, index) => ({
          ...product,
          bookId: product.bookId || `temp-id-${index}`,
        })) || [];

        setProducts(validatedProducts);
        setTotalItems(response.data.totalElements || 0);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        if (err.response?.status === 400) {
          setError('잘못된 페이지 요청입니다. 첫 페이지로 이동합니다.');
          setCurrentPage(1);
        } else {
          setError(`상품을 불러오는 데 실패했습니다: ${errorMsg}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.trim() !== '') {
      fetchProducts();
    } else {
      setProducts([]);
      setTotalItems(0);
    }
  }, [query, type, currentPage, itemsPerPage]);

  const handleSelectAll = (e) => {
    setSelectedProducts(e.target.checked ? products.map(p => p.bookId) : []);
  };

  const handleProductSelect = (bookId, isSelected) => {
    setSelectedProducts(prev =>
      isSelected ? [...prev, bookId] : prev.filter(id => id !== bookId)
    );
  };

  const handleAddToCart = async () => {
    const memberId = sessionStorage.getItem('memberId');
    if (!memberId) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart/batch`, {
        memberId,
        bookIds: selectedProducts,
      });
      if (response.status === 200) {
        alert(`${selectedProducts.length}개 상품이 장바구니에 추가되었습니다.`);
        setSelectedProducts([]);
      } else {
        throw new Error('장바구니에 추가하는 데 실패했습니다.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      alert(`장바구니에 상품을 추가하는 데 실패했습니다: ${errorMsg}`);
    }
  };

  const handleExportToExcel = () => {
    alert(`${selectedProducts.length}개 상품을 엑셀로 내보냅니다.`);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const allSelected = products.length > 0 && selectedProducts.length === products.length;

  if (error) return <div className="error-container">{error}</div>;
  if (isLoading) return <div className="loading-container">로딩 중...</div>;

  return (
    <div className="category-filter-container">
      <section className="display-options-section">
        <div className="results-count">총 <strong>{totalItems}</strong>개 상품</div>
        <div className="view-options">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="items-per-page"
          >
            <option value={20}>20개씩 보기</option>
            <option value={50}>50개씩 보기</option>
            <option value={100}>100개씩 보기</option>
          </select>
          <div className="view-mode-buttons">
            <button
              className={`view-mode-btn ${displayMode === 'grid' ? 'active' : ''}`}
              onClick={() => setDisplayMode('grid')}
            >
              <span className="icon-grid">그리드</span>
            </button>
            <button
              className={`view-mode-btn ${displayMode === 'list' ? 'active' : ''}`}
              onClick={() => setDisplayMode('list')}
            >
              <span className="icon-list">리스트</span>
            </button>
          </div>
        </div>
      </section>

      <section className="list-actions-section">
        <label className="select-all-checkbox">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
            disabled={products.length === 0}
          />
          전체 선택 
        </label>
        <div className="action-buttons">
          <button
            onClick={handleAddToCart}
            disabled={selectedProducts.length === 0}
            className="action-btn cart-btn"
          >
            <FaShoppingCart /> 장바구니 담기
          </button>
          
        </div>
      </section>

      {totalPages > 1 && (
        <div className="pagination-section">
          <button
            className="pagination-btn prev"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = totalPages <= 5
              ? i + 1
              : currentPage <= 3
                ? i + 1
                : currentPage >= totalPages - 2
                  ? totalPages - 4 + i
                  : currentPage - 2 + i;
            return (
              <button
                key={`page-${pageNum}`}
                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="pagination-btn next"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
      <div style={{ width: '1200px', margin: '0 auto' }}>
        <ProductDisplayComponent
          products={products}
          displayMode={displayMode}
          selectedProducts={selectedProducts}
          onProductSelect={handleProductSelect}
          showRank={false}
        />
      </div>

      {totalPages > 1 && (
        <div className="pagination-section">
          <button
            className="pagination-btn prev"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = totalPages <= 5
              ? i + 1
              : currentPage <= 3
                ? i + 1
                : currentPage >= totalPages - 2
                  ? totalPages - 4 + i
                  : currentPage - 2 + i;
            return (
              <button
                key={`page-${pageNum}`}
                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="pagination-btn next"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchProductList;
