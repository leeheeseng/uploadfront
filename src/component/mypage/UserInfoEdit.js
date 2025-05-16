import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './styles/UserInfoEdit.scss';

const UserInfoEdit = () => {
  const [formData, setFormData] = React.useState({
    memberId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: ''
  });

  const [originalData, setOriginalData] = React.useState({
    name: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedMemberId = sessionStorage.getItem('memberId');

    if (token && savedMemberId) {
      try {
        const decoded = jwtDecode(token);
        setFormData(prev => ({
          ...prev,
          memberId: savedMemberId
        }));

        axios.get(`/api/member/info`, {
          params: { memberId: savedMemberId }
        })
        .then(response => {
          const data = response.data;
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            birthDate: data.birthday || '',
            gender: data.gender || '',
            email: data.email || '',
            phone: data.tel || ''  // 여기 수정!
          }));
          setOriginalData({
            name: data.name || '',
            birthDate: data.birthday || '',
            gender: data.gender || '',
            email: data.email || '',
            phone: data.tel || ''
          });
        })
        .catch(error => {
          console.error('회원정보 조회 실패:', error);
        });
      } catch (error) {
        console.error('토큰 디코드 실패:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    axios.put(`/api/member/edit`, formData)
      .then(response => {
        alert('회원정보가 수정되었습니다!');
      })
      .catch(error => {
        console.error('회원정보 수정 실패:', error);
        alert('회원정보 수정에 실패했습니다.');
      });
  };

  return (
    <div className="user-info-edit">
      <h2>회원정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>새 비밀번호</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="새 비밀번호 입력"
          />
        </div>
        
        <div className="form-group">
          <label>새 비밀번호 확인</label>
          <input 
            type="password" 
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="새 비밀번호 확인"
          />
        </div>
        
        <div className="form-group">
          <label>이름</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={originalData.name || "이름 입력"}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>생년월일</label>
            <input 
              type="date" 
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>성별</label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>이메일</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={originalData.email || "이메일 입력"}
          />
        </div>
        
        <div className="form-group">
          <label>휴대폰 번호</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={originalData.phone || "휴대폰 번호 입력"}
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => window.history.back()}>취소</button>
          <button type="submit" className="submit-button">확인</button>
        </div>
      </form>
    </div>
  );
};

export default UserInfoEdit;
