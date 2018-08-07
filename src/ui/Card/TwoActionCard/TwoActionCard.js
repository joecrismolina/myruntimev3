import React from 'react';
import Card from '../Card';
import styles from './TwoActionCard.css';

const twoActionCard = (props) => {
  return (
    <Card {...props}>
      <button className={styles.ActionButton + ' ' + styles.LeftButton} onClick={props.leftActionClicked}>{props.leftActionLabel}</button>
      <button className={styles.ActionButton + ' ' + styles.RightButton} onClick={props.rightActionClicked}>{props.rightActionLabel}</button>
    </Card>
  );
};

export default twoActionCard;