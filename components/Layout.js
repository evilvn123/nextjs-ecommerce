import React from 'react';
import Modal from './Modal';
import Navbar from './Navbar';
import Notify from './Notify';

const Layout = ({children}) => {
  return (
    <div className="container">
      <Navbar />
      <Notify />
      <Modal />
      {children}
    </div>
  );
}

export default Layout;