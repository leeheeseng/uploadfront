import React, { useState } from 'react';
import Footer from '../component/footer';
import Breadcrumb from '../component/Breadcrumb';
import CategoryProductnewList from'../component/CategorynewFilterList.js'



const New = () => {


    return (
      <div style={{ width: '1200px', margin: '0 auto' }}>
        <Breadcrumb/>
       
        <CategoryProductnewList/>
        <Footer />
      </div>
    );
  };
  
  export default New;