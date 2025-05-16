import React, { useState } from 'react';
import Footer from '../component/footer';
import Breadcrumb from '../component/Breadcrumb';
import CategorySidebar from '../component/CategorySidebar';
import CategoryProductList from '../component/CategoryFilterList.js';



const Category = () => {


    return (
      <div style={{ width: '1200px', margin: '0 auto' }}>
        <Breadcrumb/>
        <div style={{ display:'flex' }}>
        <CategorySidebar/>
        
        <div style={{ width: '950px', margin: '0 auto' }}>
          
          <CategoryProductList/>
       </div>
        </div>
                       


        <Footer />
      </div>
    );
  };
  
  export default Category;