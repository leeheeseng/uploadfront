import React from 'react';
import './App.css';
import Mainpage from './pages/mainpage';
import BestPage from './pages/bastpage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewPage from './pages/new';
import Category from './pages/midlecategory';
import Smallcategory from './pages/smallcatagory';
import Subsmallcategory from './pages/subsmallcatagory';
import EventPage from './pages/eventpage';
import { CategoryProvider } from './context/CategoryContext';
import EventDetailpage from './pages/EventDetailpage';
import Cart from './pages/cartpage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DetailPage from './pages/detailpage';
import MyPage from './pages/MyPages';
import { LoginProvider } from "./context/LoginContext ";
import { CartProvider } from './context/CartContext';
import SearchPage from './pages/serachpage';  // 페이지 import 추가
import Header from './component/hader'; // Header import 추가

function App() {
  return (
    <LoginProvider>
      <CartProvider>
        <CategoryProvider>
          <Router>
            <div className="App">
              <Header />  {/* 공통 Header 추가 */}

              <Routes>
                <Route path="/" element={<Mainpage />} />
                <Route path="/best" element={<BestPage />} />
                <Route path="/new" element={<NewPage />} />
                <Route path="/category" element={<Category />} />
                <Route path="/category/:categoryId" element={<Smallcategory />} />
                <Route path="/category/:categoryId/:subCategoryId" element={<Subsmallcategory />} />
                <Route path="/events" element={<EventPage />} />
                <Route path="/events/:id" element={<EventDetailpage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/detail/:bookId" element={<DetailPage />} />
                <Route path="/mypage/*" element={<MyPage />} />
                <Route path="/search" element={<SearchPage />} /> {/* ★ 추가된 부분 */}
              </Routes>
            </div>
          </Router>
        </CategoryProvider>
      </CartProvider>
    </LoginProvider>
  );
}
export default App;