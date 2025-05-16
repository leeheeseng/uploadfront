import React, { useState } from 'react';
import '../scss/login.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLogin } from '../context/LoginContext ';

const LoginMenu = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useLogin();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!inputs.username.trim()) {
      newErrors.username = '아이디를 입력해주세요';
      isValid = false;
    }

    if (!inputs.password) {
      newErrors.password = '비밀번호를 입력해주세요';
      isValid = false;
    } else if (inputs.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/member/login', {
        userId: inputs.username,  // 서버 DTO 기준으로 userId로 보냄
        password: inputs.password
      });

      const { token, memberId, message } = response.data;

      if (token) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('memberId', memberId);
        login(); // 로그인 상태 true 처리
        alert(message || '로그인 되었습니다.');
        window.location.href = '/'// 홈으로 이동
      } else {
        alert('로그인에 실패했습니다.');
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert(error.response.data.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-menu">
      <div className="login-section">
        <h4 className="section-title">로그인</h4>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="아이디"
              className={`input-field ${errors.username ? 'error' : ''}`}
              value={inputs.username}
              onChange={handleInputChange}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              className={`input-field ${errors.password ? 'error' : ''}`}
              value={inputs.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>

      <div className="additional-links">
        <div className="signup-link">
          <a href="/signup">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default LoginMenu;
