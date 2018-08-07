import React, { Component } from 'react';

import styles from './RaceFeedback.css';

class RaceFeedback extends Component {

  state = {
    validForm : false,
    form : {
      inquiry : 'MyRunTime Photos',
      name : '',
      email : '',
      bibnumbers : '',
      activationCode : '',
      feedback : '',
      raceName : '',
    }
  }

  componentDidMount () {
    if(this.props.raceName){
      let updatedForm = {...this.state.form};
      updatedForm.raceName = this.props.raceName;
      this.setState({form: updatedForm});
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if(this.props.raceName && this.props.raceName.trim() !== '' && this.props.raceName !== prevProps.raceName){
      let updatedForm = {...this.state.form};
      updatedForm.raceName = this.props.raceName;
      this.setState({form: updatedForm});
    }
  }

  inputChangedHandler = (event, id) => {
    let newValue = event.target.value;
    let updatedForm = {...this.state.form};
    updatedForm[id] = newValue;
    this.setState({form: updatedForm, validForm: this.checkFormValidity(updatedForm)});
  }

  checkFormValidity = (form) => {
    let validForm = false;
    if( form.email.trim() !== '' && form.bibnumbers.trim() !== '' ) validForm = true;
    validForm = validForm && this.validateEmail(form.email);
    return validForm;
  }

  validateEmail = (email) => {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(email);
  }

  render () {
    return (
      <div className={styles.RaceFeedbackContainer}>
        <div className={styles.RaceFeedbackRaceName}>{this.props.raceName}</div>
          <p className={styles.RaceFeedbackLabel}>Inquiry</p>
          <select className={styles.RaceFeedbackInput} value={this.state.form.inquiry} onChange={(event) => this.inputChangedHandler(event, 'inquiry')}>
            <option value="MyRunTime Photos">MyRunTime Photos</option>
            <option value="Activation Problems">Activation Problems</option>
            <option value="Request Activation Code">Request Activation Code</option>
            <option value="Missing Time">Missing Time</option>
            <option value="Incorrect Name">Incorrect Name</option>
            <option value="Incorrect Gender">Incorrect Gender</option>
            <option value="Others">Others</option>
          </select>
          <p className={styles.RaceFeedbackLabel}>Name</p>
          <input className={styles.RaceFeedbackInput} value={this.state.form.name} onChange={(event) => this.inputChangedHandler(event, 'name')} placeholder='name' />
          <p className={styles.RaceFeedbackLabel}>Email <font color="red"> *required</font></p>
          <input className={styles.RaceFeedbackInput} type="email" value={this.state.form.email} onChange={(event) => this.inputChangedHandler(event, 'email')} placeholder='email' />    
          <p className={styles.RaceFeedbackLabel}>Bib Number(s) <font color="red"> *required</font></p>
          <input className={styles.RaceFeedbackInput} value={this.state.form.bibnumbers} onChange={(event) => this.inputChangedHandler(event, 'bibnumbers')} placeholder='bib number(s)' />
          <p className={styles.RaceFeedbackLabel}>Activation Code(s)</p>
          <input className={styles.RaceFeedbackInput} value={this.state.form.activationCode} onChange={(event) => this.inputChangedHandler(event, 'activationCode')} placeholder='activation code(s)' />
          <p className={styles.RaceFeedbackLabel}>Additional Feedback</p>
          <textarea rows="3" className={styles.RaceFeedbackInput} resize="none" value={this.state.form.feedback} onChange={(event) => this.inputChangedHandler(event, 'feedback')} placeholder='additional message...' />
          <div className={styles.RaceFeedbackActionContainers}>
            <button className={styles.RaceFeedbackCancelButton} onClick={() => this.props.onCancel()}>CANCEL</button>
            <button className={styles.RaceFeedbackSubmitButton} onClick={() => this.props.onSubmit(this.state.form)} disabled={!this.state.validForm}>SUBMIT</button>
          </div>
      </div>
    );
  }
};

export default RaceFeedback;