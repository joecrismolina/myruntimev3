import React, { Component } from 'react';

import styles from './ConnectRace.css';

class ConnectRace extends Component {

  state = {
    validForm: false,
    bibnumber: '',
    bibnumberReadOnly: false,
    code: '',
    myruntimeEvent: false
  }

  componentDidMount () {
    let myruntimeEvent = false;
    if(this.props.isMyruntimeEvent) myruntimeEvent = this.props.isMyruntimeEvent;
    if(this.props.bibnumber && this.props.bibnumber.trim() !== ''){
      this.setState({bibnumber: this.props.bibnumber, bibnumberReadOnly: true, myruntimeEvent: myruntimeEvent});
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if(this.props.bibnumber && this.props.bibnumber.trim() !== '' && this.props.bibnumber !== prevProps.bibnumber){
      this.setState({bibnumber: this.props.bibnumber, bibnumberReadOnly: true});
    }
    if(prevProps.isMyruntimeEvent !== this.props.isMyruntimeEvent) {
      this.setState({myruntimeEvent: this.props.isMyruntimeEvent});
    }
  }

  inputChangedHandler = (event, id) => {
    let newValue = event.target.value;
    if(id === 'bibnumber') this.setState({bibnumber: newValue, validForm: this.checkFormValidity(newValue, this.state.code)});
    else this.setState({code: newValue, validForm: this.checkFormValidity(this.state.bibnumber, newValue)});
  }

  checkFormValidity = (bibnumber, code) => {
    let validForm = false;
    if( bibnumber.trim() !== '' ) validForm = true;
    if(this.state.myruntimeEvent) {
      validForm = validForm && (code.trim() !== '')
    }
    return validForm;
  }

  render () {

    let bibInput = <input className={styles.ConnectRaceInput} value={this.state.bibnumber} onChange={(event) => this.inputChangedHandler(event, 'bibnumber')} placeholder='bib number'/>;
    if(this.state.bibnumberReadOnly) bibInput = <input className={styles.ConnectRaceInputReadOnly} value={this.state.bibnumber} readOnly/>;

    let codeInput = null;
    if(this.state.myruntimeEvent) codeInput = (<input className={styles.ConnectRaceInput} value={this.state.code} onChange={(event) => this.inputChangedHandler(event, 'code')} placeholder='activation code' />);

    return(
      <div className={styles.ConnectRaceContainer}>
        <div className={styles.ConnectRaceName}>{this.props.raceName}</div>
        {bibInput}
        {codeInput}
        <div className={styles.ActionContainers}>
          <button className={styles.ConnectRaceCancelButton} onClick={() => this.props.onCancel()}>CANCEL</button>
          <button className={styles.ConnectRaceConnectButton} onClick={() => this.props.onConnect(this.state.bibnumber, this.state.code)} disabled={!this.state.validForm}>CONNECT</button>
        </div>
      </div>
    );
  }
};

export default ConnectRace;