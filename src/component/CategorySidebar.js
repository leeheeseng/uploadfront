import React, { useEffect, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../scss/CategorySidebar.scss';

const CategorySidebar = ({ onPeriodChange, initialPeriod = 'sort', bestPeriod = 'sort' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const isBestPage = location.pathname.startsWith('/best');
  const isCategoryPage = location.pathname.startsWith('/category');
  const pathDepth = location.pathname.split('/').filter(Boolean).length;

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    setCategories(storedCategories);
  }, []);

  useEffect(() => {
    if (!isCategoryPage) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      return;
    }

    const pathParts = location.pathname.split('/').filter(Boolean);
    const pathCategoryId = pathParts.length > 1 ? parseInt(pathParts[1], 10) : null;
    const pathSubCategoryId = pathParts.length > 2 ? parseInt(pathParts[2], 10) : null;

    if (pathDepth === 1) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else if (pathDepth === 2) {
      const category = categories.find((cat) => cat.id === pathCategoryId);
      setSelectedCategory(category);
      setSelectedSubCategory(null);
    } else if (pathDepth === 3) {
      const category = categories.find((cat) => cat.id === pathCategoryId);
      setSelectedCategory(category);
      if (category?.subCategories?.length) {
        const subCategory = category.subCategories.find(
          (subCat) => subCat.id === pathSubCategoryId
        );
        setSelectedSubCategory(subCategory);
      } else {
        setSelectedSubCategory(null);
      }
    }
  }, [location.pathname, isCategoryPage, pathDepth, categories]);

  const handleCategoryClick = useCallback((categoryId) => {
    navigate(`/category/${categoryId}`);
  }, [navigate]);

  const handleSubCategoryClick = useCallback((subCategoryId) => {
    if (!selectedCategory) return;
    navigate(`/category/${selectedCategory.id}/${subCategoryId}`);
  }, [navigate, selectedCategory]);

  const handleTitleClick = useCallback(() => {
    const currentPathDepth = location.pathname.split('/').filter(Boolean).length;
    if (currentPathDepth === 3) {
      navigate(`/category/${selectedCategory.id}`);
    } else if (currentPathDepth === 2) {
      navigate('/category');
    }
  }, [navigate, location.pathname, selectedCategory]);

  const handlePeriodChange = useCallback((period) => {
    onPeriodChange?.(period);
  }, [onPeriodChange]);

  return (
    <aside className="category-sidebar">
      {isBestPage ? (
        <div className="category-group">
          <div className="upper-category">베스트셀러</div>
          <ul className="sub-category-list">
            <li 
              className={bestPeriod === 'sort' ? 'active' : ''} 
              onClick={() => handlePeriodChange('sort')}
            >
              평점순
            </li>
            <li 
              className={bestPeriod === 'discaount' ? 'active' : ''} 
              onClick={() => handlePeriodChange('discount')}
            >
              할인순
            </li>
          </ul>
        </div>
      ) : (
        <div className="category-group">
          {selectedCategory ? (
            <>
              <div 
                className="upper-category clickable" 
                onClick={handleTitleClick}
              >                
              <span className="arrow">&lt;</span>

                {selectedSubCategory?.name || selectedCategory.name}
              </div>
              {selectedCategory.subCategories?.length > 0 && !selectedSubCategory && (
                <ul className="sub-category-list">
                  {selectedCategory.subCategories.map(subCategory => (
                    <li 
                      key={subCategory.id} 
                      className={selectedSubCategory?.id === subCategory.id ? 'active' : ''} 
                      onClick={() => handleSubCategoryClick(subCategory.id)}
                    >
                       {subCategory.name}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <div className="upper-category">전체</div>
              <ul className="sub-category-list">
                {categories.map(category => (
                  <li 
                    key={category.id} 
                    className={selectedCategory?.id === category.id ? 'active' : ''} 
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </aside>
  );
};

export default React.memo(CategorySidebar);
