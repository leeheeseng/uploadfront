import React, { useState } from 'react';
import Footer from '../component/footer';
import Detail from '../component/detail';
import Breadcrumb from '../component/Breadcrumbdetail';




const DetailPage= () => {


  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <Breadcrumb/>

      <Detail/> 
      <Footer/>
    </div>
  );
};

export default DetailPage;