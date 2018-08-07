import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card';

const simpleCard = (props) => {
  return (
    <Link to={props.link} style={{textDecoration:'none'}}>
      <Card {...props} />
    </Link>
  );
};

export default simpleCard;