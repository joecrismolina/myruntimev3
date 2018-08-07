import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Toolbar from '../../components/Toolbar/Toolbar';
import SideDrawer from '../../components/SideDrawer/SideDrawer';

class Header extends Component {

  state = {
    showSideDrawer: false,
  }

  sideDrawerClosedHandler = () => {
    this.setState({showSideDrawer: false});
  }

  sideDrawerShowHandler = () => {
    this.setState({showSideDrawer: true});
  }

  toggleSideDrawerHandler = () => {
    this.setState ((prevProps) => {
      return ({showSideDrawer: !prevProps.showSideDrawer});
    });
  };

  componentDidUpdate () { }

  render () {
    return (
      <Aux>
        <Toolbar navLinks={this.props.navLinks} drawerToggleClicked={this.toggleSideDrawerHandler} history={this.props.history}/>
        <SideDrawer navLinks={this.props.navLinks} closed={this.sideDrawerClosedHandler} open={this.state.showSideDrawer}/>
      </Aux>
    );
  }
}

export default Header;