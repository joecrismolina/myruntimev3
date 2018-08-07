import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from './hoc/Auxiliary/Auxiliary';
import Header from './containers/Header/Header';
import MobileNavs from './components/MobileNavs/MobileNavs';
import AboutUs from './components/AboutUs/AboutUs';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import Signup from './components/Signup/Signup';
import HomePage from './containers/Content/HomePage/HomePage';
import NewsFeed from './containers/Content/NewsFeed/NewsFeed';
import UpcomingRaces from './containers/Content/UpcomingRaces/UpcomingRaces';
import RecentRaces from './containers/Content/RecentRaces/RecentRaces';
import AllRaces from './containers/Content/AllRaces/AllRaces';
import Race from './containers/Content/Race/Race';
import Article from './containers/Content/NewsFeed/Article/Article';
import User from './containers/Content/User/User';
import Analysis from './containers/Content/Analysis/Analysis';
import Ecertificate from './containers/Content/Ecertificate/Ecertificate';
import PasswordReset from './components/PasswordReset/PasswordReset';
import AccountActivate from './components/AccountActivate/AccountActivate';
import TermsOfService from './components/TermsOfService/TermsOfService';
import PageNotFound from './ui/PageNotFound/PageNotFound';
import styles from './App.css';
import * as actionTypes from './store/actions';
import * as navLinks from './NavigationLinks';
import serverReq from './http/serverAxios';
import * as endpointUrls from './http/endpointUrls';
import MainConnect from './containers/Content/MainConnect/MainConnect';

class App extends Component {

  state = {
    loading: true,
    currentPathName : '',
    mobileNavLinks : [],
    headerLinks : []
  }

  componentWillMount () {
    this.verifyUserSession();
    this.setNavigationLinks();
  }

  componentDidMount () {
    this.verifyFacebookSession();
  }

  componentDidUpdate (prevProps, prevState) {
    if( (window.location.pathname !== this.state.currentPathName) || ( prevProps.user !== this.props.user) ){
      this.setNavigationLinks();
    }
  }

  setNavigationLinks = () => {
    let mobileNavLinks = [];
    let headerNavLinks = [];
    if(this.props.user){
      mobileNavLinks = navLinks.UserNavLinks.filter( l => (l.enabled && l.mobile));
      headerNavLinks = navLinks.UserNavLinks.filter( l => (l.enabled));
    }
    else{
      mobileNavLinks = navLinks.GuestNavLinks.filter( l => (l.enabled && l.mobile));
      headerNavLinks = navLinks.GuestNavLinks.filter( l => (l.enabled));
    }
    headerNavLinks.forEach( el => {
      if(el.link === window.location.pathname) el.active = true;
      else el.active = false;
    });
    mobileNavLinks.forEach( el => {
      if(el.link === window.location.pathname) el.active = true;
      else el.active = false;
    });
    this.setState({currentPathName: window.location.pathname, headerLinks: headerNavLinks, mobileNavLinks: mobileNavLinks});
  }

  verifyFacebookSession = () => {
    window.fbAsyncInit = function() {
        window.FB.init({
          appId            : endpointUrls.fbAppId,
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v3.0'
        });
        window.FB.getLoginStatus( response => {
          if(response.status === 'connected'){ }
        })
        window.FB.Event.subscribe('auth.statusChange', response => {
          if(response.status === 'connected'){
            if(response.authResponse) { }
            else { }
          }
        })
      };
      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
  }

  userConnectedViaFacebook = () => {
    
  }

  verifyUserSession = () => {
    this.setState({loading: true});
    serverReq.get('/api/user')
      .then( resp => {
        if(resp.data.status === 'ok'){
          this.props.onLogin(resp.data.data);
        }
        else{ }
      })
      .catch (resp => { });
  }

  render() {
    return (
          <Aux>
            <Header navLinks={this.state.headerLinks} history={this.props.history}/>
            <MobileNavs items={this.state.mobileNavLinks}/>
            <div className={styles.App}>
              <Switch>
                <Route path="/" exact component={HomePage}/>
                <Route path="/login" component={Login}/>
                <Route path="/logout" component={Logout}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/forgot-password" render={() => <h1>Forgot Password</h1>}/>
                <Route path="/upcoming-races" component={UpcomingRaces}/>
                <Route path="/recent-races" component={RecentRaces}/>
                <Route path="/news-feed" exact component={NewsFeed}/>
                <Route path="/about-us" component={AboutUs}/>
                <Route path="/careers" render={() => <h1>Careers Page</h1>}/>
                <Route path="/race" component={Race} />
                <Route path='/races/all' component={AllRaces} />
                <Route path='/me' exact component={User} />
                <Route path='/user' exact component={User} />
                <Route path='/results' exact component={Analysis}/>
                <Route path='/ecert' exact component={Ecertificate}/>
                <Route path='/connect' exact component={MainConnect} />
                <Route path="/news-feed/article" component={Article}/>
                <Route path="/account/activate" component={AccountActivate} />
                <Route path="/account/password/reset" component={PasswordReset} />
                <Route path="/tos" component={TermsOfService}/>     
                <Route component={PageNotFound}/>
              </Switch>
            </div>
          </Aux>    
    );
  }
}

const mapStateToProps = state => {
  return {
    user : state.user
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin : (user) => dispatch({type: actionTypes.USER_LOGIN, user: user}),
    onLogout : () => dispatch({type: actionTypes.USER_LOGOUT})
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
