import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../scss/signup.scss';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const handleCheckUserId = async () => {
    if (!formData.userId.trim()) {
      setErrors(prev => ({ ...prev, userId: '아이디를 입력해주세요' }));
      return;
    }

    try {
      const response = await axios.get('/api/member/check-id', {
        params: { loginId: formData.userId }
      });
      if (response.data) {
        alert('이미 사용 중인 아이디입니다.');
      } else {
        alert('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      console.error('중복 확인 실패:', error);
      alert('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.userId.trim()) {
      newErrors.userId = '아이디를 입력해주세요';
      isValid = false;
    } else if (formData.userId.length < 4) {
      newErrors.userId = '아이디는 4자 이상이어야 합니다';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      isValid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
      isValid = false;
    }

    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요';
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요';
      isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = '유효한 전화번호를 입력해주세요';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const requestData = {
      login_id: formData.userId,
      password: formData.password,
      member_name: formData.name,
      birthday: formData.birthDate,
      gender: formData.gender,
      email: formData.email,
      tel: formData.phone,
    };

    try {
      const response = await axios.post('/api/member/signup', requestData);
      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      

      <div className="signup-form">
        <h2>회원정보입력</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">아이디</label>
            <div className="input-with-button">
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="4자 이상의 아이디"
                className={errors.userId ? 'error' : ''}
              />
              <button type="button" className="check-button" onClick={handleCheckUserId}>
                중복확인
              </button>
            </div>
            {errors.userId && <span className="error-message">{errors.userId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="6자 이상의 비밀번호"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 다시 입력"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="실명을 입력해주세요"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">생년월일</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={errors.birthDate ? 'error' : ''}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>

          <div className="form-group">
            <label>성별</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                />
                남성
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                여성
              </label>
            </div>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">휴대폰 번호</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="'-' 없이 입력"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="button-group">
            <button type="button" className="cancel-button" onClick={() => navigate('/')}>
              취소
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
