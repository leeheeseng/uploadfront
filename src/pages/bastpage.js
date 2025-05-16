import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../component/footer';
import Breadcrumb from '../component/Breadcrumb';
import CategorySidebar from '../component/CategorySidebar';
import CategorybestProductList from '../component/CategoryBestFilterList';
const Best = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPeriod, setCurrentPeriod] = useState('daily');
  const [bestProducts, setBestProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // URL 파라미터 처리
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const period = searchParams.get('period');

    if (!period) {
      navigate('/best?period=sort', { replace: true });
      return;
    }

    if (['sort', 'discount'].includes(period)) {
      if (currentPeriod !== period) {
        setCurrentPeriod(period);
      }
    } else {
      navigate('/best?period=sort', { replace: true });
    }
  }, [location.search, navigate, currentPeriod]);

  // 기간 변경 핸들러
  const handlePeriodChange = useCallback((period) => {
    if (currentPeriod !== period) {
      setCurrentPeriod(period);
      navigate(`?period=${period}`, { replace: true });
    }
  }, [currentPeriod, navigate]);

  return (
    <div style={{ width: '1200px', margin: '0 auto', padding: '20px' }}>
      <Breadcrumb 
        currentPeriod={currentPeriod}
        isBestPage={true}
        showPeriodLabel={true}
      />

      <div style={{ display: 'flex',  marginTop: '20px' }}>
        <CategorySidebar 
          bestPeriod={currentPeriod}
          onPeriodChange={handlePeriodChange}
        />

        <div style={{ width: '950px', margin: '0 auto' }}>
          {isLoading ? (
            <div>로딩 중...</div>
          ) : (
            <CategorybestProductList 
              initialProducts={bestProducts} 
              bestPeriod={currentPeriod}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Best;
