import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../scss/cart.scss';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const memberId = sessionStorage.getItem("memberId");
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!memberId) {
      setError("로그인 후 이용해 주세요.");
      setLoading(false);
      navigate('/login'); 
    } else {
      const storedUsername = sessionStorage.getItem("username");
      setUsername(storedUsername || '');
    }
  }, [memberId]);

  const fetchCartItems = useCallback(async () => {
    if (!memberId) {
      setError("로그인 후 이용해 주세요.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/cart/${memberId}/books`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cartWithDefaults = response.data.map(book => {
        const discountAmount = book.price * (book.discountRate / 100);
        return {
          ...book,
          checked: false,
          quantity: book.quantity,
          discountPrice: book.price - discountAmount
        };
      });
      setCartItems(cartWithDefaults);
      setLoading(false);
    } catch (error) {
      setError("장바구니 데이터를 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }, [memberId, token]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateCartQuantityOnServer = async (cartId, quantity) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/cart/${cartId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      console.error("서버에 수량 업데이트 중 오류 발생:", error);
      throw error;
    }
  };

  const deleteMultipleCartItemsFromServer = async (ids) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/batch`, {
        headers: { Authorization: `Bearer ${token}` },
        data: ids
      });
    } catch (error) {
      console.error("서버에서 선택 아이템들 삭제 중 오류 발생:", error);
    }
  };

  const toggleAllItems = (checked) => {
    const updatedItems = cartItems.map(item => ({ ...item, checked }));
    setCartItems(updatedItems);
  };

  const removeCheckedItems = async () => {
    const idsToDelete = cartItems.filter(item => item.checked).map(item => item.cartId);
    const validIds = idsToDelete.filter(id => id !== null);
    if (validIds.length === 0) {
      alert("삭제할 아이템이 없습니다.");
      return;
    }
    try {
      await deleteMultipleCartItemsFromServer(validIds);
      setCartItems(prev => prev.filter(item => !item.checked));
    } catch (error) {
      console.error("선택 삭제 처리 중 에러 발생:", error);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cartItems.find(item => item.cartId === cartId);
    if (!item) return;
    try {
      await updateCartQuantityOnServer(cartId, newQuantity);
      await fetchCartItems();
    } catch (error) {
      console.error("수량 업데이트 중 에러 발생:", error);
    }
  };

  const toggleItemCheck = (cartId) => {
    const updatedItems = cartItems.map(item =>
      item.cartId === cartId ? { ...item, checked: !item.checked } : item
    );
    setCartItems(updatedItems);
  };

  const handleOrder = async () => {
    const checkedItems = cartItems.filter(item => item.checked);
    if (!token) {
      alert("로그인이 필요합니다!");
      return;
    }
    if (checkedItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    setOrderItems(checkedItems);
    setShowModal(true);
  };

  const confirmOrder = async () => {
    try {
      const orderPayload = orderItems.map(item => ({
        cartId: item.cartId,
        bookId: item.bookId,
        memberId: memberId,
        quantity: item.quantity,
        purchaseDate: new Date().toISOString()
      }));
      const response = await axios.post(
        `http://localhost:8080/api/purchases`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const idsToDelete = orderItems.map(item => item.cartId);
      await deleteMultipleCartItemsFromServer(idsToDelete);
      fetchCartItems();
      setShowModal(false);
      alert("주문이 완료되었습니다.");
    } catch (error) {
      console.error("주문 요청 중 에러 발생:", error);
      alert("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const cancelOrder = () => {
    setShowModal(false);
  };

  const checkedItems = cartItems.filter(item => item.checked);
  const originalTotalPrice = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = checkedItems.reduce((sum, item) => sum + (item.discountPrice * item.quantity), 0);
  const allChecked = cartItems.length > 0 && cartItems.every(item => item.checked);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={`cart-container ${showModal ? 'modal-open' : ''}`}>
      <div className="cart-layout">
        <div className="cart-items-section">
          <section className="management-section">
            <h2>장바구니({cartItems.length})</h2>
            <div className="management-actions">
              <label className="select-all">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => toggleAllItems(e.target.checked)}
                />
                전체 선택
              </label>
              <button className="delete-btn" onClick={removeCheckedItems}>선택 삭제</button>
            </div>
          </section>

          <div className="items-list">
            {cartItems.map(item => (
              <div key={item.cartId} className={`cart-item ${item.checked ? 'checked' : ''}`}>
                <div className="item-check">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItemCheck(item.cartId)}
                  />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.title}</h3>
                  <p className="item-variant">저자: {item.author}</p>
                  <p className="item-info">출판사: {item.publisher}</p>
                  <div className="item-price-info">
                    <span className="original-price">{Math.round(item.price).toLocaleString()}원</span>
                    <span className="discount-price">{Math.round(item.discountPrice).toLocaleString()}원</span>
                    <span className="discount-rate">{item.discountRate}%</span>
                  </div>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary-section">
          <div className="order-summary">
            <h3>결제 예정금액</h3>
            <div className="price-details">
              <div className="price-row">
                <span>상품 금액</span>
                <span>{Math.round(originalTotalPrice).toLocaleString()}원</span>
              </div>
              <div className="price-row">
                <span>할인된 금액</span>
                <span>-{Math.round(originalTotalPrice - totalDiscount).toLocaleString()}원</span>
              </div>
              <div className="price-row total">
                <span>총 결제금액</span>
                <span>{Math.round(totalDiscount).toLocaleString()}원</span>
              </div>
            </div>
            <button className="order-button" onClick={handleOrder}>주문하기</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={`modal-overlay ${showModal ? 'show' : ''}`}>
          <div className="modal">
            <div className='modal-body'>
            <h3>주문 확인</h3>
            <p>선택한 상품을 주문하시겠습니까?</p>
            <ul>
              {orderItems.map(item => (
                <li key={item.cartId}>
                  {item.title} - {item.quantity}개 {Math.round(item.discountPrice).toLocaleString()}원
                </li>
              ))}
            </ul>
            <span>총 결제금액</span>
            <span>{Math.round(totalDiscount).toLocaleString()}원</span>
            <div>
              <button onClick={confirmOrder}>확인</button>
              <button onClick={cancelOrder}>취소</button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
