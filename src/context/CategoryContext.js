import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from "axios"; // 상단에 추가

// ✅ 누락된 export 추가
export const CategoryContext = createContext();

const CATEGORY_STORAGE_KEY = "categories"; // 로컬스토리지 키

const getCategoriesFromStorage = () => {
  const storedCategories = localStorage.getItem(CATEGORY_STORAGE_KEY);
  return storedCategories ? JSON.parse(storedCategories) : null;
};

const saveCategoriesToStorage = (categories) => {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const cachedCategories = getCategoriesFromStorage();
      if (cachedCategories) {
        console.log("✅ 로컬스토리지에서 불러옴");
        console.log(cachedCategories);
        setCategories(cachedCategories);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
        setCategories(response.data);
        saveCategoriesToStorage(response.data);
        console.log("🔄 서버에서 가져와 로컬스토리지에 저장함");
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  const selectedCategory = useMemo(() => (
    categories.find(c => c.id === selectedCategoryId) || null
  ), [categories, selectedCategoryId]);

  const selectedSubCategory = useMemo(() => {
    if (!selectedCategory || !selectedSubCategoryId) return null;
    return selectedCategory.subCategories.find(sc => sc.id === selectedSubCategoryId) || null;
  }, [selectedCategory, selectedSubCategoryId]);

  const selectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null); // 상위 카테고리 선택 시 서브카테고리 초기화
  };

  const selectSubCategory = (subCategoryId) => {
    if (!selectedCategoryId) return;
    setSelectedSubCategoryId(subCategoryId);
  };

  const resetSelection = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
  };

  const contextValue = {
    categories,
    selectedCategory,
    selectedSubCategory,
    selectCategory,
    selectSubCategory,
    resetSelection,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

CategoryProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

// 🔹 로컬스토리지 초기화 API
export const clearCategories = () => {
  localStorage.removeItem(CATEGORY_STORAGE_KEY);
  console.log("❌ 로컬스토리지 데이터 삭제됨");
};
