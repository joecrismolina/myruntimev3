import React from 'react';
import GoogleAds from '../GoogleAds';
import styles from './HorizontalAds.css';

const horizontalGoogleAds = (props) => {
  return (
    <div className={styles.Ads}>
        <GoogleAds dataAdClient='ca-pub-9740154250975682' dataAdSlot='9796421050'/>
    </div>
  );
};

export default horizontalGoogleAds;