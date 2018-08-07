import React from 'react';
import styles from './Footer.css';
import fbLogoSmall from '../../assets/images/facebook50x50.png';
import igLogoSmall from '../../assets/images/instagram50x50.png';
import twitterLogoSmall from '../../assets/images/twitter50x50.png';

const footer = (props) => {
  return (
    <div className={styles.Footer}>
      <a href="https://www.facebook.com/myruntime">
        <img src={fbLogoSmall} alt="fb"/>
      </a>
      <a href="https://www.instagram.com/myruntime?ref=badge">
        <img src={igLogoSmall} alt="ig"/>
      </a>
      <a href="https://www.twitter.com/intent/follow?screen_name=myruntime">
        <img src={twitterLogoSmall} alt="twitter"/>
      </a>
      <p>MYRUNTIME Copyright 2018</p>
    </div>
  );
};

export default footer;