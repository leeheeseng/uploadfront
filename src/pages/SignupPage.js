import React, { useState } from 'react';
import Footer from '../component/footer';
import Singin from '../component/signup';




const SigninPage= () => {


  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <Singin/> 
      <Footer/>
    </div>
  );
};

export default SigninPage;