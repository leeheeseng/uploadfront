import React, { useState } from 'react';
import Footer from '../component/footer';
import Event from '../component/Event';




const Eventpage= () => {


  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
        <Event/>
      <Footer />
    </div>
  );
};

export default Eventpage;