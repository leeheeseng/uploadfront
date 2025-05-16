import React, { useState } from 'react';
import Footer from '../component/footer';
import Cart from '../component/cart';




const Eventpage= () => {


  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <Cart/>
      <Footer />
    </div>
  );
};

export default Eventpage;