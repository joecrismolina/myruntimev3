import React, { Component } from 'react';

import styles from './SearchBar.css';

class SearchBar extends Component {

  state = {
    validSearchInput : false,
    inputValue : ''
  }

  textChangedHandler = (event) => {
    const newInputValue = event.target.value;
    this.setState({inputValue: newInputValue, validSearchInput: this.checkSearchParamsValidity(newInputValue)});
  }

  checkSearchParamsValidity = (inputValue) => {
    let validInput = false;
    validInput = (inputValue.trim() !== '');
    if(this.props.minInputLength) {
      validInput = validInput && (inputValue.length >= this.props.minInputLength)
    }
    return validInput;
  }

  render () {
    return (
      <div className={styles.SearchBar}>
        <input type="text" placeholder={this.props.placeholder} value={this.state.inputValue} onChange={this.textChangedHandler}/>
        <button disabled={!this.state.validSearchInput} onClick={() => this.props.searchHandler(this.state.inputValue)}>
          <div className={styles.SearchLabel}>Search</div>
          <div className={styles.SearchIcon}>
            <i className='material-icons'>search</i>
          </div>
        </button>
      </div>
    );
  }
};

export default SearchBar;