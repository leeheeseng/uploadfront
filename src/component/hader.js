import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../scss/header.scss";
import Logo from "../img/logo_book.svg";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [saveSearchEnabled, setSaveSearchEnabled] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);

  const searchInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const searchHistoryRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const memberId = sessionStorage.getItem("memberId");
    if (memberId) setIsLoggedIn(true);

    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

    const saveSetting = localStorage.getItem("saveSearchEnabled");
    if (saveSetting !== null) setSaveSearchEnabled(saveSetting === "true");

    const savedCategories = localStorage.getItem("categories");
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    localStorage.setItem("saveSearchEnabled", saveSearchEnabled.toString());
  }, [searchHistory, saveSearchEnabled]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (
        searchHistoryRef.current &&
        !searchHistoryRef.current.contains(event.target) &&
        event.target !== searchInputRef.current
      ) {
        setIsSearchHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    if (saveSearchEnabled) {
      setSearchHistory([
        { text: searchText, date: new Date().toLocaleDateString() },
        ...searchHistory.filter((item) => item.text !== searchText).slice(0, 9),
      ]);
    }
    console.log("검색 실행:", searchText);
    navigate(`/search?query=${encodeURIComponent(searchText)}&type=${searchType}`);
  };

  const deleteSearchItem = (index) => {
    const newHistory = [...searchHistory];
    newHistory.splice(index, 1);
    setSearchHistory(newHistory);
  };

  const clearAllHistory = () => setSearchHistory([]);

  const selectSearchHistory = (text) => {
    setSearchText(text);
    setIsSearchHistoryOpen(false);
    searchInputRef.current.focus();
    navigate(`/search?query=${encodeURIComponent(text)}&type=${searchType}`);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("memberId");
    navigate("/"); // 새로고침 없는 로그아웃 이동
  };

  return (
    <header className="header">
      <div className="middle">
        <div className="search-container">
          <div
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            style={{ cursor: "pointer" }}
          >
            <img src={Logo} alt="교보문고 로고" />
          </div>

          <div className="search-wrapper" ref={searchHistoryRef}>
            <div className="search-box">
              <select
                className="search-type-dropdown"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="title">제목</option>
                <option value="Writer">작가</option>
              </select>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setIsSearchHistoryOpen(true);
                }}
                onFocus={() => setIsSearchHistoryOpen(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-btn" onClick={handleSearch}>
                <img src={require("../img/search_16.png")} alt="검색" />
              </button>
            </div>

            {isSearchHistoryOpen && searchHistory.length > 0 && (
              <div className="search-history-dropdown">
                <div className="search-history-header">
                  <span>최근검색어</span>
                  <button onClick={clearAllHistory}>전체삭제</button>
                </div>
                <ul className="search-history-list">
                  {searchHistory.map((item, index) => (
                    <li key={index}>
                      <span className="history-text" onClick={() => selectSearchHistory(item.text)}>
                        {item.text}
                      </span>
                      <div className="history-meta">
                        <span className="history-date">{item.date}</span>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSearchItem(index);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="search-history-footer">
                  <label>
                    <input
                      type="checkbox"
                      checked={saveSearchEnabled}
                      onChange={(e) => setSaveSearchEnabled(e.target.checked)}
                    />
                    검색어 저장
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="user-menu">
          {isLoggedIn ? (
            <button onClick={handleLogout}>로그아웃</button>
          ) : (
            <>
              <span onClick={() => navigate("/signup")} style={{ cursor: "pointer" }}>회원가입</span>
              <span className="separator"></span>
              <span onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>로그인</span>
            </>
          )}
          <img
            src={require("../img/btn_header_cart@2x.png")}
            alt="장바구니"
            width="32"
            height="32"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/cart")}
          />
          <img
            src={require("../img/btn_header_my@2x.png")}
            alt="마이페이지"
            width="32"
            height="32"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/mypage")}
          />
        </div>
      </div>

      <div className="bottom" ref={categoryDropdownRef}>
        <div className="category-dropdown">
          <div
            className="category-toggle"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setIsCategoryOpen(!isCategoryOpen)}
          >
            <img
              src={require(`../img/${isCategoryOpen ? "btn_anb_open_active@2x.png" : "btn_anb_open@2x.png"}`)}
              alt="카테고리"
              width="44"
              height="44"
            />
          </div>

          {isCategoryOpen && (
            <ul className="dropdown-menu">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`category-item ${expandedCategories.includes(category.id) ? "active" : ""}`}
                >
                  <div className="main-category">
                    <span
                      className="category-link"
                      onClick={() => navigate(`/category/${category.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {category.name}
                    </span>
                    {category.subCategories.length > 0 && (
                      <button
                        className={`arrow-btn ${expandedCategories.includes(category.id) ? "open" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category.id);
                        }}
                        aria-label={`${category.name} 하위 메뉴 토글`}
                      >
                        {expandedCategories.includes(category.id) ? "▲" : "▼"}
                      </button>
                    )}
                  </div>
                  {expandedCategories.includes(category.id) && (
                    <ul className="sub-category-list">
                      {category.subCategories.map((subCat) => (
                        <li key={subCat.id}>
                          <span
                            onClick={() => navigate(`/category/${category.id}/${subCat.id}`)}
                            style={{ cursor: "pointer" }}
                          >
                            {subCat.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="category-links">
            <span onClick={() => navigate("/best")} style={{ cursor: "pointer" }}>베스트</span>
            <span onClick={() => navigate("/new")} style={{ cursor: "pointer" }}>신상품</span>
            <span onClick={() => navigate("/events")} style={{ cursor: "pointer" }}>이벤트</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
