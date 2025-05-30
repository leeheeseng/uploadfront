import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryFilterProductDisplayComponent from './newProductDisplayComponent';
import { useCategory } from '../context/CategoryContext';
import '../scss/allnewCategoryFilterList.scss';
import { useLocation } from 'react-router-dom';

const CategoryProductnewList = () => {
  const { topCategoryId, subCategoryId } = useParams();
  const navigate = useNavigate();
  const { categories } = useCategory();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [displayMode, setDisplayMode] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [activeDescription, setActiveDescription] = useState(null);
  const [descriptionPage, setDescriptionPage] = useState(1);
  const charsPerPage = 500;

  useEffect(() => {
    console.log('카테고리 정보 설정 시작');
    if (!categories.length) {
      console.log('카테고리 데이터가 아직 로드되지 않음');
      return;
    }
    if (topCategoryId) {
      const topCategory = categories.find(cat => cat.id === parseInt(topCategoryId));
      console.log('상위 카테고리 설정:', topCategory);
      setSelectedCategory(topCategory || null);
    } else {
      console.log('상위 카테고리 없음');
      setSelectedCategory(null);
    }
    if (subCategoryId) {
      let subCategory = null;
      for (const cat of categories) {
        const found = cat.subCategories?.find(sc => sc.id === parseInt(subCategoryId));
        if (found) {
          subCategory = found;
          break;
        }
      }
      console.log('하위 카테고리 설정:', subCategory);
      setSelectedSubCategory(subCategory || null);
    } else {
      console.log('하위 카테고리 없음');
      setSelectedSubCategory(null);
    }
  }, [topCategoryId, subCategoryId, categories]);

  useEffect(() => {
    console.log('상품 데이터 가져오기 시작 - 페이지:', currentPage, '크기:', itemsPerPage);
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let url = `${process.env.REACT_APP_API_BASE_URL}/api/detail/category-products`;
        const params = { 
          page: Math.max(0, currentPage - 1),
          size: itemsPerPage
        };

        const path = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        let period = '';

        if (path.startsWith('/best')) {
          const urlPeriod = searchParams.get('period');
          period = urlPeriod === 'discount' ? 'discount' : 'rating';
        } else if (path.startsWith('/new')) {
          period = 'new';
        }

        if (period) {
          params.period = period;
        }

        if (topCategoryId) params.topCategoryId = topCategoryId;
        if (subCategoryId) params.subCategoryId = subCategoryId;

        console.log('API 요청 파라미터:', params);
        const response = await axios.get(url, { params });

        let validatedProducts = response.data.content?.map((product, index) => ({
          ...product,
          bookId: product.bookId || `temp-id-${index}`
        })) || [];

        // 할인율 기준으로 정렬
        validatedProducts.sort((a, b) => (b.discountRate || 0) - (a.discountRate || 0));
        console.log('할인율 기준으로 정렬 완료');

        setProducts(validatedProducts);
        setTotalItems(response.data.totalElements || 0);
        console.log('상품 데이터 설정 완료 - 개수:', validatedProducts.length, '전체 개수:', response.data.totalElements);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        console.error('API 호출 오류 상세:', {
          message: err.message,
          response: err.response,
          stack: err.stack
        });
        if (err.response?.status === 400) {
          setError('잘못된 페이지 요청입니다. 첫 페이지로 이동합니다.');
          setCurrentPage(1);
        } else {
          setError(`상품을 불러오는 데 실패했습니다: ${errorMsg}`);
        }
      } finally {
        setIsLoading(false);
        console.log('로딩 상태 종료');
      }
    };
    fetchProducts();
  }, [topCategoryId, subCategoryId, currentPage, itemsPerPage, location]);

  const handleCategoryChange = (newTopId, newSubId = null) => {
    console.log('카테고리 변경 - 상위:', newTopId, '하위:', newSubId);
    setCurrentPage(1);
    if (newSubId) navigate(`/category/${newTopId}/${newSubId}`);
    else if (newTopId) navigate(`/category/${newTopId}`);
    else navigate('/category');
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    console.log('전체 선택 상태 변경:', isChecked);
    setSelectedProducts(isChecked ? currentItems.map(p => p.bookId) : []);
  };

  const handleProductSelect = (bookId, isSelected) => {
    console.log('상품 선택 변경 - ID:', bookId, '선택 상태:', isSelected);
    setSelectedProducts(prev =>
      isSelected ? [...prev, bookId] : prev.filter(id => id !== bookId)
    );
  };

  const handleAddToCart = async () => {
    console.log('장바구니 추가 - 선택된 상품:', selectedProducts);
  
    // 로컬스토리지에서 memberId 가져오기
    const memberId = sessionStorage.getItem('memberId');
  
    if (!memberId) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart/batch`, {
        memberId: memberId,       // memberId 추가
        bookIds: selectedProducts, // 선택된 상품 ID 목록
      });
  
      if (response.status === 200) {
        alert(`${selectedProducts.length}개 상품이 장바구니에 추가되었습니다.`);
        setSelectedProducts([]); // 장바구니에 추가한 후 선택 상태 초기화
      } else {
        throw new Error('장바구니에 추가하는 데 실패했습니다.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error('장바구니 API 호출 오류:', err);
      alert(`장바구니에 상품을 추가하는 데 실패했습니다: ${errorMsg}`);
    }
  };

  const handleExportToExcel = () => {
    console.log('엑셀 내보내기 - 선택된 상품:', selectedProducts);
    alert(`${selectedProducts.length}개 상품을 엑셀로 내보냅니다.`);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = products;
  const allSelected = currentItems.length > 0 && selectedProducts.length === currentItems.length;
  const totalDescPages = Math.ceil((activeDescription?.length || 0) / charsPerPage);

  if (error) return <div className="error-container">{error}</div>;
  if (isLoading) return <div className="loading-container">로딩 중...</div>;

  return (
    <div className="product-list-container">
      <section className="product-display-options">
        
        <div className="product-view-options">
          <div className="product-results-count">총 <strong>{totalItems}</strong>개 상품</div>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              console.log('페이지 당 아이템 수 변경:', e.target.value);
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="items-per-page-select"
          >
            <option value={20}>20개씩 보기</option>
            <option value={50}>50개씩 보기</option>
            <option value={100}>100개씩 보기</option>
          </select>
          <div className="view-mode-btns">
            <button
              className={`view-mode-btn ${displayMode === 'grid' ? 'active' : ''}`}
              onClick={() => setDisplayMode('grid')}
            >
              <span className="grid-icon">그리드</span>
            </button>
            <button
              className={`view-mode-btn ${displayMode === 'list' ? 'active' : ''}`}
              onClick={() => setDisplayMode('list')}
            >
              <span className="list-icon">리스트</span>
            </button>
          </div>
        </div>
      </section>

      <section className="product-actions-section">
        <label className="select-all-checkbox">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
            disabled={currentItems.length === 0}
          />
          전체 선택 
        </label>
        <div className="product-action-buttons">
          <button
            onClick={handleAddToCart}
            disabled={selectedProducts.length === 0}
            className="action-btn "
          >
            <FaShoppingCart /> 장바구니 담기
          </button>
        </div>
      </section>

      <div style={{ width: '1200px', margin: '0 auto' }}>
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
        <CategoryFilterProductDisplayComponent
          products={currentItems.map((product, index) => ({
            ...product,
            bookId: product.bookId || `temp-id-${index}`,
          }))}
          displayMode={displayMode}
          selectedProducts={selectedProducts}
          onProductSelect={handleProductSelect}
          showRank={false}
          topCategoryId={topCategoryId}
          subcategoryId={subCategoryId}
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

export default CategoryProductnewList;
