import React from 'react'
import cl from './MyFooter.module.css';
import { Link } from 'react-router-dom';

const MyFooter = () => {

  return (
    <footer className={`${cl.my_footer}`}>
      <div className={`${"container-fluid"} ${"pt-4"}`}>
        <div className={`${"row"}`}>
          <div className={`${"col-lg-4"} ${"col-md-12"} ${cl.footer_text} ${"text-center"}`}>
            <p>Tournament 2024 ® - Your Tournament Assistant</p>
          </div>
          <div className={`${"col-lg-4"} ${"col-md-12"} ${cl.footer_text} ${"text-center"}`}>
            <p><Link className={cl.my_footer_link} to='/feedback'>Feedback</Link></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MyFooter