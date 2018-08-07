import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Toolbar.css';
import Logo from '../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../DrawerToggle/DrawerToggle';

class Toolbar extends Component {

  state = {
    searchParam : '',
    validSearch : false
  }

  componentDidMount () {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount () {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate () { }

  searchParamChanged = (event) => {
    const updatedParam = event.target.value;
    let updatedValidity = false;
    if(updatedParam.trim() !== '' && updatedParam.length >= 3) updatedValidity = true;
    this.setState({searchParam: updatedParam, validSearch: updatedValidity});
  }

  handleKeyDown = (event) => {
    if(event.keyCode === 13 && this.state.validSearch) {
      this.props.history.push("/races/all?search=" + this.state.searchParam);
    }
  }

  render () {
    return (
      <header className={styles.Toolbar}>
        <DrawerToggle clicked={this.props.drawerToggleClicked}/>
        <div className={styles.Logo}>
          <NavLink to="/" exact><Logo /></NavLink>
        </div>
        <nav className={styles.DesktopOnly}>
          <NavigationItems navLinks={this.props.navLinks} />
        </nav>
        <div className={styles.ToolbarSearch}>
          <input className={styles.ToolbarSearchInput} 
                  type="text" 
                  placeholder="search races" 
                  value={this.state.searchParam}
                  onChange={(event) => this.searchParamChanged(event)}/>
          <div className={styles.ToolbarSearchButtonGroup}>
            <NavLink to={"/races/all?search=" + this.state.searchParam} exact>
              <button disabled={!this.state.validSearch} className={styles.ToolbarSearchButton}>
                <i className="material-icons" style={{fontSize: '18px'}}>search</i>
              </button>
            </NavLink>
          </div>
        </div>
      </header>
    )
  }
};

export default Toolbar;