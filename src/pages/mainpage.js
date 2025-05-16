import React, { useEffect, useState } from 'react';
import Footer from '../component/footer';
import Book_slider_main from '../component/list/Book_slider_main';
import Event_slider_main from '../component/list/Event_Slider_Main';
import axios from 'axios';

const Main = () => {
  const [books, setBooks] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/detail/category-products', {
          params: {
            page: 0,
            size: 20,
            period: 'rating',
            topCategoryId: 1
          }
        });
        setBooks(response.data.content);
      } catch (error) {
        console.error('도서 데이터를 불러오는 중 에러 발생:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/events/ONGOING');
        setEvents(response.data);  // 리스트 그대로 세팅
      } catch (error) {
        console.error('이벤트 데이터를 불러오는 중 에러 발생:', error);
      }
    };
    

    fetchBooks();
    fetchEvents();
  }, []);

  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <Book_slider_main books={books} />
      <Event_slider_main events={events} />
      <Footer />
    </div>
  );
};

export default Main;
