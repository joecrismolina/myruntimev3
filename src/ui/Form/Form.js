import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import styles from './Form.css';
import Input from '../Input/Input';

class Form extends Component {

  state = {
    submitting : false,
    validForm : false,
    formFields : {
      inquiry: {
        label : 'Inquiry',
        elementType: 'select',
        elementConfig : {
          name : 'inquiry',
          options: [
           { value: 'Race Timing services', displayValue: 'Race Timing services' },
           { value: 'Online Registration services', displayValue: 'Online Registration services' },
           { value: 'Order Fulfillment', displayValue: 'Order Frulfillment' },
           { value: 'Submit an event', displayValue: 'Submit an event' },
          ]
        },
        value: 'Race Timing services',
        validation : {},
        valid : true,
        pristine : true
      },
      name: {
        label : 'Name',
        elementType: 'input',
        elementConfig : {
          name : 'name',
          type: 'text',
          placeholder:'juan dela cruz'
        },
        value: '',
        validation : {
          required : true
        },
        valid : false,
        pristine : true
      },
      affiliation: {
        label : 'Affiliation',
        elementType: 'input',
        elementConfig : {
          name : 'affiliation',
          type: 'text',
          placeholder:'abc company'
        },
        value: '',
        validation : {
          required : true
        },
        valid : false,
        pristine : true
      },
      email: {
        label : 'Email',
        elementType: 'input',
        elementConfig : {
          name : 'email',
          type: 'email',
          placeholder:'jdc@abc.com'
        },
        value: '',
        validation : {
          required : true,
          isEmail : true
        },
        valid : false,
        pristine : true
      },
      contactNo: {
        label : 'Contact No.',
        elementType: 'input',
        elementConfig : {
          name : 'contactNo',
          type: 'text',
          placeholder:'+639171231234'
        },
        value: '',
        validation : {
          required : true
        },
        valid : false,
        pristine : true
      },
      eventName: {
        label : 'Event Name',
        elementType: 'input',
        elementConfig : {
          name : 'eventName',
          type: 'text',
          placeholder:'my event'
        },
        value: '',
        validation : {
          required : true
        },
        valid : false,
        pristine : true
      },
      additionalMessage: {
        label : 'Additional Message',
        elementType: 'textarea',
        elementConfig : {
          name : 'additionalMessage',
          type: 'text',
          rows: 3,
          placeholder:'in a galaxy far far away...'
        },
        value: '',
        validation : {},
        valid : true,
        pristine : true
      }
    }
  }

  formSubmitHandler = (event) => {
    event.preventDefault();
  }

  checkValidity = (value, rules) => {
    let isValid = true;

    if(rules){  
  
      if(rules.required) {
        isValid = isValid && (value.trim() !== '');
      }

      if(rules.minLength) {
        isValid = isValid && (value.length >= rules.minLength);
      }

      if(rules.maxLength) {
        isValid = isValid && (value.length <= rules.maxLength);
      }

      if(rules.isEmail) {
        isValid = isValid && (this.validateEmail(value));
      }

      // .. add more checking here

    }

    return isValid;
  }

  validateEmail = (email) => {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(email);
  }

  inputChangedHandler = (event, inputKey) => {
    const updatedForm = { ...this.state.formFields }
    const updatedFormElement = {
      ...updatedForm[inputKey]
    }
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.pristine = false;
    updatedForm[inputKey] = updatedFormElement;

    let isFormValid = true;
    for( let inputKey in updatedForm ) {
      isFormValid = updatedForm[inputKey].valid && isFormValid;
    }

    this.setState({formFields: updatedForm, validForm: isFormValid}); 
  }

  render () {
    const fromElemetsArray = [];
    for (let key in this.state.formFields) {
      fromElemetsArray.push({
        id: key,
        config: this.state.formFields[key]
      })
    }
    return (
      <Aux>
        <form className={styles.Form} onSubmit={this.formSubmitHandler}>
          {
            fromElemetsArray.map( el => {
              return (
                <Input 
                  key={el.id}
                  valid={el.config.valid}
                  shouldValidate={el.config.validation}
                  pristine={el.config.pristine}
                  inputtype={el.config.elementType}
                  value={el.config.value}
                  label={el.config.label}
                  elementConfig={el.config.elementConfig}
                  changed={(event) => this.inputChangedHandler(event, el.id) }
                />
              )
            })
          }
          <button className={styles.SubmitButton} disabled={!this.state.validForm} onClick={() => this.props.onSubmit(this.state.formFields)}> SUBMIT </button>
        </form>
      </Aux>
    );
  }
}

export default Form;