import React, { Component } from 'react';
import Modal from '../Modal/Modal';
import Spinner from '../Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import styles from './EditableInfoCard.css';
import * as utils from '../../utils/utils';

class EditableInfoCard extends Component {

  state = {
    loading: false,
    showModal: false,
    value: '',
    prevValue: ''
  }

  componentDidMount () {
    if(this.props.value) this.setState({value: this.props.value, prevValue: this.props.value});
  }

  editInfo = () => {
    if(this.props.editable) this.setState({showModal: true});
    else return;
  }

  hideModal = () => {
    const prevValue = this.state.prevValue;
    this.setState({showModal: false, value: prevValue});
  }

  inputChangedHandler = (event) => {
    this.setState({value: event.target.value});
  }

  cancelChangesHandler = () => {
    const prevValue = this.state.prevValue;
    this.setState({showModal: false, value: prevValue});
  }

  saveChangesHandler = () => {
    const value = this.state.value;
    this.setState({showModal: false, prevValue: value});
    this.props.onSaveChanges(this.state.value, this.props.identifier);
  }

  render () {

    let cardStyle = [styles.InfoValue].join(' ');
    if(this.props.editable) cardStyle  = [styles.InfoValue, styles.Editable].join(' ');

    let verifiedMessage = null;
    let verifyLabelStyle = [styles.VerifiedInfoLabel].join(' ');
    if(this.props.verifiable && this.props.verified) {
      verifiedMessage = (<Aux><i className="material-icons">check_circle</i> Verified</Aux>);
      verifyLabelStyle = [styles.VerifiedInfoLabel].join(' ');
    }
    if(this.props.verifiable && !this.props.verified) {
      verifiedMessage = (<Aux><i className="material-icons">error</i>verify this info</Aux>);
      verifyLabelStyle = [styles.UnverifiedInfoLabel].join(' ');
    }

    let editInput = (<input type="text" value={this.state.value} onChange={(event) => this.inputChangedHandler(event)}/>);
    if(this.props.type === 'date') {
      editInput = (<input type="date" value={utils.parseDateForInput(this.state.value)} onChange={(event) => this.inputChangedHandler(event)}/>);
    }
    if(this.props.type === 'email') {
      editInput = (<input type="date" value={this.state.value} onChange={(event) => this.inputChangedHandler(event)}/>);
    }
    if(this.props.type === 'select') {
      (
        editInput = <select value={this.state.value} onChange={(event) => this.inputChangedHandler(event)}>
          {
            this.props.options.options.map( o =>  
              (<option key={o.value} value={o.value}>{o.label}</option>)
            )
          }
        </select>
      );
    }
    if(this.props.type === 'textarea') {
      editInput = <textarea rows="3" resize="none" value={this.state.value} onChange={(event) => this.inputChangedHandler(event)}/>
    }

    let displayValue = null;
    if(this.props.subtype === 'text') displayValue = this.state.value;
    else if(this.props.subtype === 'gender') displayValue = utils.formatGender(this.state.value);
    else if(this.props.subtype === 'date') displayValue = utils.formatDate(this.state.value);
    else displayValue = this.state.value;

    return (
      <Aux>
        <Spinner loading={this.state.loading}/>
        <Modal title='Edit' show={this.state.showModal} modalClosed={this.hideModal} style={{padding: '16px 0 0 0'}}>
          <div className={styles.EditInputContainer}>
            {editInput}
          </div>
          <div className={styles.EditButtonsContainer}>
            <button className={styles.EditCancelButton} onClick={this.cancelChangesHandler}><i className="material-icons">close</i></button>
            <button className={styles.EditSaveButton} onClick={this.saveChangesHandler}><i className="material-icons">check</i></button>
          </div>
        </Modal>
        <div className={styles.EditableInfoCard}>
          <div className={cardStyle} onClick={this.editInfo}>
            {displayValue}
          </div>
          <div className={styles.InfoFooterContainer}>
            <div className={styles.InfoLabel}>
              {this.props.label}
            </div>
            <div className={verifyLabelStyle}>
              {verifiedMessage}
            </div>
          </div>
        </div>
      </Aux>
    )
  }
};

export default EditableInfoCard;