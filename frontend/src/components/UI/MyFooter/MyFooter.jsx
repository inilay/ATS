import React from 'react'
import cl from './MyFooter.module.css';


const MyFooter = () => {

  return (
    <footer className={`${cl.my_footer}`}>
      <div className={`${"container-fluid"} ${"pt-4"}`}>
        <div className={`${"row"}`}>
          <div className={`${"col-lg-4"} ${"col-md-12"} ${cl.footer_text} ${"text-center"}`}>
            <p>Tournament 2023 ® - Your Tournament Assistant</p>
          </div>
          <div className={`${"col-lg-4"} ${"col-md-12"} ${cl.footer_text} ${"text-center"}`}>
            <p><a className={cl.my_footer_link} href="https://t.me/indiora" target="_blank">Feedback</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MyFooter