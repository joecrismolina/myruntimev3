import React from 'react';
import Card from '../Card';
import styles from './OneActionCard.css';

const oneActionCard = (props) => {
  return (
    <Card {...props}>
      <button className={styles.ActionButton} onClick={props.actionClicked}>{props.actionLabel}</button>
    </Card>
  );
};

export default oneActionCard;