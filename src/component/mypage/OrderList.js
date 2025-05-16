import React, { useEffect, useState } from 'react';
import './styles/OrderList.scss';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [bookDetails, setBookDetails] = useState({});
  const memberId = localStorage.getItem("memberId");
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/purchases/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);

      const bookIds = [...new Set(response.data.map(order => order.bookId))];
      const bookDetailPromises = bookIds.map(id =>
        axios.get(`http://localhost:8080/api/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      const details = await Promise.all(bookDetailPromises);
      const detailMap = {};
      details.forEach(detail => {
        detailMap[detail.data.bookId] = detail.data;
      });
      setBookDetails(detailMap);

    } catch (error) {
      console.error("주문 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (memberId && token) {
      fetchOrders();
    }
  }, [memberId, token]);

  const handleDeleteOrder = async (orderDate) => {
    try {
      const purchaseIds = orders
        .filter(order => new Date(order.purchaseDate).toLocaleDateString('ko-KR') === orderDate)
        .map(order => order.purchaseId);

      const response = await axios.delete(`http://localhost:8080/api/purchases/delete`, {
        data: {
          purchaseIds: purchaseIds,
          memberId: memberId
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        fetchOrders();
      } else {
        console.error("주문 삭제 실패");
      }
    } catch (error) {
      console.error("주문 삭제 오류:", error);
    }
  };

  const groupedOrders = orders.reduce((groups, order) => {
    const orderDate = new Date(order.purchaseDate).toLocaleDateString('ko-KR');
    if (!groups[orderDate]) {
      groups[orderDate] = [];
    }
    groups[orderDate].push(order);
    return groups;
  }, {});

  return (
    <div className="order-list">
      <h2>주문 조회</h2>
      {Object.keys(groupedOrders)
        .sort((a, b) => new Date(b) - new Date(a))  // ===> 최근일자 순 정렬 적용!
        .map(orderDate => {
          const dayOrders = groupedOrders[orderDate];

          return (
            <div key={orderDate} className="order-date-box">
              <div className="order-items">
                <div className="order-header">
                  <span className="order-date-id">
                    주문일자: {orderDate}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteOrder(orderDate)}
                  >
                    삭제
                  </button>
                </div>

                <div className="items-header">
                  <span>제품명</span>
                  <span>가격</span>
                  <span>수량</span>
                  <span>합계</span>
                </div>

                {dayOrders.map(order => {
                  const book = bookDetails[order.bookId];
                  return (
                    <div key={order.orderId} className="order-item">
                      <div className="order-items">
                        <div className="item-row">
                          <span className="item-title">
                            {book ? book.title : "로딩중..."}
                          </span>
                          <span className="item-price">
                            {book ? `${book.price.toLocaleString()}원` : "-"}
                          </span>
                          <span className="item-quantity">
                            {order.quantity}
                          </span>
                          <span className="item-total">
                            {book ? `${(book.price * order.quantity).toLocaleString()}원` : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="order-footer">
                  <div className="shipping-info">
                    <h4>배송 정보</h4>
                    {dayOrders[0].deliveryDate ? (
                      <p>도착 예정일: {new Date(dayOrders[0].deliveryDate).toLocaleDateString('ko-KR')}</p>
                    ) : (
                      <p>배송 준비 중</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default OrderList;
