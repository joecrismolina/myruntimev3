import React from 'react';
import styles from './Card.css';
import ProgressiveImage from '../../ui/ProgressiveImage/ProgressiveImage';

const card = (props) => {
  return (
    <div className={styles.Card}>
      <ProgressiveImage src={props.cardImage} alt="card banner" />
      <div className={styles.InfoBox}>
        <p className={styles.CardTitle}>{props.title}</p>
        <p className={styles.CardHeading1}>{props.heading1}</p>
        <p className={styles.CardHeading2}>{props.heading2}</p>
        <p className={styles.CardHeading3}>{props.heading3}</p>
      </div>
      <div className={styles.CardChildren}>{ props.children }</div>
    </div>
  );
};

export default card;