import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// 장바구니 컨텍스트 생성
const CartContext = createContext();

// 장바구니에서 memberId를 가져오는 함수
const getMemberIdFromLocalStorage = () => {
  const memberId = localStorage.getItem('memberId');
  return memberId ? memberId : null;
};

// 장바구니 컨텍스트 제공자
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 장바구니에 제품 추가 함수
  const addToCart = (product) => {
    const memberId = getMemberIdFromLocalStorage(); // 로컬스토리지에서 memberId 가져오기
    
    if (!memberId) {
      console.error('로그인된 사용자가 없습니다');
      return;
    }

    // 로컬에서 장바구니에 추가
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.bookId === product.bookId);
      if (existingProduct) {
        return prevCart.map(item =>
          item.bookId === product.bookId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // 백엔드에 장바구니 추가 요청
    axios.post('/api/cart', {
      memberId: memberId, // 로그인된 사용자의 memberId
      bookId: product.bookId,
      quantity: 1 // 기본적으로 수량 1개 추가
    })
    .then(response => {
      console.log('장바구니에 상품이 추가되었습니다', response.data);
    })
    .catch(error => {
      console.error('장바구니 추가 중 오류 발생', error);
    });
  };

  // 장바구니에서 제품 제거 함수
  const removeFromCart = (bookId) => {
    setCart(prevCart => prevCart.filter(item => item.bookId !== bookId));
  };

  // 장바구니 전체 비우기 함수
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 장바구니 관련 데이터와 함수 사용을 위한 훅
export const useCart = () => useContext(CartContext);
