import React, { useState } from 'react';
import '../scss/Footer.scss';
import { ReactComponent as LogoBook } from '../img/logo_book.svg'; // SVG 컴포넌트 방식 import

const Footer = () => {
  return (
    <div className="footer_body">
      <div className="footer_inner">
        <div className="top_row">
          <LogoBox />
          <RightBox />
        </div>
        <FooterContents />
      </div>
    </div>
  );
};

const LogoBox = () => {
  return (
    <div className="logo_box">
      <a href="" className="logo_link book">
        <LogoBook className="logo" alt="교보문고 로고" />
      </a>
    </div>
  );
};

const RightBox = () => {
  const [isFamilySiteOpen, setIsFamilySiteOpen] = useState(false);

  const toggleFamilySite = () => {
    setIsFamilySiteOpen(!isFamilySiteOpen);
  };

  return (
    <div className="right_box">
      {/* 필요시 family site 토글 버튼 등 추가 */}
    </div>
  );
};

const FooterContents = () => {
  return (
    <div className="footer_contents_wrap">
      <FooterContentsLeft />
      <FooterContentsRight />
    </div>
  );
};

const FooterContentsLeft = () => {
  const footerMenu = [
    { text: '클론코드소개', url: '', target: '_blank' },
    { text: '클론코드이용약관', url: '' },
    { text: '클론코드처리방침', url: '', className: 'privacy' },
    { text: '클론코드보호정책', url: '' },
    { text: '클론코드안내', url: '' },
    { text: '클론코드여러분', url: '' },
    { text: '클론코드정보', url: '', target: '_blank' },
    { text: '클론코드소개', url: '', target: '_blank' },
  ];

  return (
    <div className="footer_contents_left">
      <div className="footer_menu_box">
        <ul className="footer_menu_list">
          {footerMenu.map((menu, index) => (
            <li key={index} className={`footer_menu_item ${menu.className || ''}`}>
              <a className="footer_menu_link" href={menu.url} target={menu.target || '_self'}>
                {menu.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <FooterInfo />
      <div className="copyright">
      </div>
    </div>
  );
};

const FooterInfo = () => {
  return (
    <address className="footer_info_box">
      <span className="info_text">대표이사 : 클론코드</span>
      <span className="gap">|</span>
      <span className="info_text">서울특별시 클론코드구 클론코드로 1</span>
      <span className="gap">|</span>
      <span className="info_text">사업자등록번호 : 클론코드-클론코드-클론코드</span> <br />
      <span className="info_text call">대표전화 : 클론코드-클론코드(발신자 부담전화)</span>
      <span className="gap">|</span>
      <span className="info_text">FAX : 클론코드-클론코드-클론코드(지역번호 공통)</span>
      <span className="gap">|</span>
      <span className="info_text">서울특별시클론코드번호 : 제 클론코드1호</span>
      <a href="" className="btn_footer_link" target="_blank">
        클론코드정보확인안함
      </a>
    </address>
  );
};

const FooterContentsRight = () => {
  return (
    <div className="footer_contents_right">
      <div className="footer_service">
        <span className="service_text">클론코드페이먼츠 구매안전서비스 </span>
        <a href="" className="btn_footer_link" target="_blank">
          서비스 가입 확인
        </a>
        <p className="service_desc">
          고객님은 안전거래를 위해 현금 등으로 결제시 저희클론코드에서 가입한 <br />
          클론코드 페이먼츠의 구매안전서비스를 이용하실 수 없습니다.
        </p>
      </div>
      <div className="footer_mark_isms">
        <a target="_blank" href="" className="mark_link">
          클론코드관리체계<br />
          클론코드 인증획득
        </a>
        <p className="mark_desc">
          [인증범위] 인터넷 클론코드 및 브랜드 서비스 운영<br />
          [유효기간] 클론코드 ~ 클론코드
        </p>
      </div>
    </div>
  );
};

export default Footer;
