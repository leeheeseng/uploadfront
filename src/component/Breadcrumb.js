import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCategory } from '../context/CategoryContext';
import '../scss/Breadcrumb.scss';

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
  const pathnames = location.pathname.split('/').filter(x => x);

  const { categories } = useCategory();

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
      </ol>
    </nav>
  );
};

export default Breadcrumb;
