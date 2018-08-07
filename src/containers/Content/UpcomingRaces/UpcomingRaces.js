import React, { Component } from 'react';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Spinner from '../../../ui/Spinner/Spinner';
import OneActionCard from '../../../ui/Card/OneActionCard/OneActionCard';
import TwoActionCard from '../../../ui/Card/TwoActionCard/TwoActionCard';
import Modal from '../../../ui/Modal/Modal';
import SearchBar from '../../../ui/SearchBar/SearchBar';
import styles from './UpcomingRaces.css';
import serverReq from '../../../http/serverAxios';
import * as utils from '../../../utils/utils';

class UpcomingRaces extends Component {

  state = {
    loading : true,
    showModal : false,
    upcomingRaces : [],
    displayPage : 1
  }

  componentDidMount () {
    serverReq.get('/api/races/upcoming?page=1')
      .then( resp => {
        let upcomingRaces = resp.data.data.concat();
        this.setState({upcomingRaces: upcomingRaces, loading: false});
        this.throttleTimer = null;
        this.throttleDelay = 100;
        window.addEventListener('scroll', this.scrollHandler);
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  scrollHandler = (event) => {
    clearTimeout(this.throttleTimer);
    this.throttleTimer = setTimeout( () => {
      const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom >= docHeight) {
        this.loadMore();
      }
    }, this.throttleDelay);
  }

  loadMore = () => {
    if(this.state.loading) return;
    const nextPage = this.state.displayPage + 1;
    this.setState({loading: true});
    serverReq.get('/api/races/upcoming?page=' + nextPage)
      .then( resp => {
        let fetchedRaces = this.state.upcomingRaces.concat(resp.data.data);
        this.setState({upcomingRaces: fetchedRaces, loading: false, displayPage: nextPage});
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  hideModal = () => {
    this.setState({showModal: false});
  }

  goToRaceDetailsPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=details'
    })
  }

  goToRaceRegistrationPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=registration'
    })
  }

  searchRaces = (searchParam) => {
    this.props.history.push('/races/all?search=' + searchParam);
  }

  render () {
    return (
      <Aux>
        <Spinner loading={this.state.loading}/>
        <Modal title='Ooops' show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>Error loading races</h2>
        </Modal>
        <div className={styles.UpcomingRaces}>
          <div className={styles.RacesContainer}>
            {
              this.state.upcomingRaces.map( el => {
                if(el.myruntimeRegistrationEnabled) {
                  return(
                    <TwoActionCard
                      key={el._id} 
                      cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                      title={el.raceName} 
                      heading1={utils.formatDate(el.raceDate)} 
                      heading2={el.raceAddress}
                      leftActionLabel="DETAILS"
                      leftActionClicked={() => this.goToRaceDetailsPage(el.raceNick) }
                      rightActionLabel="REGISTER"
                      rightActionClicked={() => this.goToRaceRegistrationPage(el.raceNick)} />
                  );
                }
                else {
                  return(
                    <OneActionCard
                      key={el._id} 
                      cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                      title={el.raceName} 
                      heading1={utils.formatDate(el.raceDate)} 
                      heading2={el.raceAddress}
                      actionLabel="DETAILS"
                      actionClicked={() => this.goToRaceDetailsPage(el.raceNick) } />
                  );
                }
              })
            }
          </div>
        </div>
        <div className={styles.MobileSearchGroup}>
          <SearchBar placeholder='search races' searchHandler={this.searchRaces} minInputLength='3'/>
        </div>
      </Aux>
    );
  }
};

export default UpcomingRaces; 