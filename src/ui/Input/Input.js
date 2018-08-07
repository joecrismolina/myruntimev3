import React from 'react';
import styles from './Input.css';

const input = (props) => {
  
  let inputGroupClass = [styles.InputGroup];
  let inputElement = null;

  let validationMessage = '';

  if(!props.valid && props.shouldValidate && !props.pristine) {
    inputGroupClass.push(styles.InvalidInputGroup);
    validationMessage = ' - please enter a valid value';
  }

  switch (props.inputtype) {
    case ('input') :
      inputElement = <input {...props.elementConfig} value={props.value} onChange={props.changed}/>;
      break;

    case ('textarea') :
      inputElement = <textarea {...props.elementConfig} value={props.value} onChange={props.changed}/>
      break;

    case ('select') :
      inputElement = (
        <select  {...props.elementConfig} value={props.value} onChange={props.changed}>
        {
          props.elementConfig.options.map( el => {
            return <option key={el.value} value={el.value}>{el.displayValue}</option>
          })
        }
        </select>
      );
      break;

    default : 
      inputElement = <input {...props.elementConfig} value={props.value} onChange={props.changed}/>; 
  }
  
  return (
    <div className={inputGroupClass.join(' ')}>
      <label>{props.label}{validationMessage}</label>
      { inputElement }
    </div>
  );
};

export default input;