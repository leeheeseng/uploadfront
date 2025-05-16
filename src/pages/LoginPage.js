import React, { useState } from 'react';
import Footer from '../component/footer';
import Login from '../component/login';




const Loginpage= () => {


  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <Login/> 
      <Footer/>
    </div>
  );
};

export default Loginpage;