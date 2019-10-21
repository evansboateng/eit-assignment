import React from 'react';
import AccountsUIWrapper from '../AccountsUIWrapper.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

const Nav = () => {
  return (
    <nav className="navbar  navbar-expand-lg navbar-dark bg-dark">
      <a href="#" className="navbar-brand">
        EIT Management App
      </a>
      <div className="btn btn-primary">
        <AccountsUIWrapper />
      </div>
    </nav>
  );
};

export default Nav;
