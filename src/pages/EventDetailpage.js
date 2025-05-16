import React, { useState } from 'react';
import Footer from '../component/footer';
import Eventdetail from '../component/eventdetail';




const Eventpage= () => {


  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
        <Eventdetail/>
      <Footer />
    </div>
  );
};

export default Eventpage;