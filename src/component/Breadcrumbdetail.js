import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useCategory } from '../context/CategoryContext';
import '../scss/Breadcrumb.scss';
import axios from 'axios';
// 카테고리 및 서브카테고리 관련 로직 분리
const getCategoryNameById = (categories, id) => {
  const category = categories.find(cat => cat.id === parseInt(id, 10));
  return category ? category.name : id;
};

const getSubCategoryNameById = (categories, categoryId, subCategoryId) => {
  const category = categories.find(cat => cat.id === parseInt(categoryId, 10));
  const sub = category?.subCategories?.find(sc => sc.id === parseInt(subCategoryId, 10));
  return sub ? sub.name : subCategoryId;
};

const getLabelFromPath = (pathnames, categories, segment, index) => {
  if (pathnames[0] !== 'category') return segment;

  if (index === 0) return '전체'; // 첫번째가 category일 때 '전체' 출력
  if (index === 1) return getCategoryNameById(categories, segment); // /category/:categoryId
  if (index === 2) {
    return parseInt(segment, 10) === 0 ? '전체' : getSubCategoryNameById(categories, pathnames[1], segment);
  }

  return segment;
};

const Breadcrumb = ({
  currentPeriod = 'daily',
  showPeriodLabel = false,
  isBestPage = false
}) => {
  const location = useLocation();
  const { bookId } = useParams(); // 책 ID 가져오기
  const [bookData, setBookData] = useState(null); // 책 데이터 상태
  const pathnames = location.pathname.split('/').filter(x => x);
  const { categories } = useCategory();

  // 책 상세 정보 가져오기
  useEffect(() => {
    if (bookId) {
      // API 호출 예시 (책 정보를 가져오는 부분)
      axios.get(`http://localhost:8080/api/detail/${bookId}`)
        .then(response => {
          setBookData(response.data);
        })
        .catch(error => {
          console.error('책 정보를 가져오는 데 실패했습니다.', error);
        });
    }
  }, [bookId]);

  // 책의 카테고리 breadcrumb 렌더링
  const renderBookCategoryBreadcrumb = () => {
    if (bookData) {
      const topCategoryName = getCategoryNameById(categories, bookData.topCategoryId);
      const subCategoryName = getSubCategoryNameById(categories, bookData.topCategoryId, bookData.subcategoryId);

      return (
        <>
          <li className="breadcrumb__separator">/</li>
          <li className="breadcrumb__item">
            <a href={`/category/${bookData.topCategoryId}`} className="breadcrumb__link">
              <span className="breadcrumb__text">{topCategoryName}</span>
            </a>
          </li>
          <li className="breadcrumb__separator">/</li>
          <li className="breadcrumb__item">
            <a href={`/category/${bookData.topCategoryId}/subCategory/${bookData.subcategoryId}`} className="breadcrumb__link">
              <span className="breadcrumb__text">{subCategoryName}</span>
            </a>
          </li>
        </>
      );
    }
    return null;
  };

  return (
    <nav aria-label="Breadcrumb" className={`breadcrumb ${isBestPage ? 'breadcrumb--best' : ''}`}>
      <ol className="breadcrumb__list">
        <li className="breadcrumb__item">
          <a href="/" className="breadcrumb__link breadcrumb__link--home">
            <span className="breadcrumb__text">홈</span>
          </a>
        </li>

        {isBestPage && (
          <>
            <li className="breadcrumb__separator">/</li>
            <li className="breadcrumb__item">
              <a href="/best" className="breadcrumb__link">
                <span className="breadcrumb__text">베스트셀러</span>
              </a>
            </li>
            {showPeriodLabel && (
              <>
                <li className="breadcrumb__separator">/</li>
                <li className="breadcrumb__item breadcrumb__item--current">
                  <span className="breadcrumb__text breadcrumb__period">
                    {currentPeriod === 'sort' ? '평점순' : '할인순'}
                  </span>
                </li>
              </>
            )}
          </>
        )}

        {!isBestPage && pathnames.map((path, index) => {
          const isLast = index === pathnames.length - 1;
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = getLabelFromPath(pathnames, categories, path, index);

          // 'detail' 페이지와 책 ID 경로는 제외하고 카테고리만 표시
          if (path === 'detail' || !isNaN(path)) {
            return null;
          }

          return (
            <React.Fragment key={`${path}-${index}`}>
              <li className="breadcrumb__separator">/</li>
              <li className={`breadcrumb__item ${isLast ? 'breadcrumb__item--current' : ''}`}>
                {isLast ? (
                  <span className="breadcrumb__text">{label}</span>
                ) : (
                  <a href={routeTo} className="breadcrumb__link">
                    <span className="breadcrumb__text">{label}</span>
                  </a>
                )}
              </li>
            </React.Fragment>
          );
        })}

        {/* 책 상세 페이지에서는 카테고리만 표시 */}
        {bookId && renderBookCategoryBreadcrumb()}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
