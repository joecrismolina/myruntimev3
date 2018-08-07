import React, { Component } from 'react';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Spinner from '../../../ui/Spinner/Spinner';
import OneActionCard from '../../../ui/Card/OneActionCard/OneActionCard';
import TwoActionCard from '../../../ui/Card/TwoActionCard/TwoActionCard';
import Modal from '../../../ui/Modal/Modal';
import SearchBar from '../../../ui/SearchBar/SearchBar';
import styles from './RecentRaces.css';
import serverReq from '../../../http/serverAxios';
import * as utils from '../../../utils/utils';

class RecentRaces extends Component {

  state = {
    loading : true,
    showModal : false,
    recentRaces : [],
    displayPage : 1
  }

  componentDidMount () {
    serverReq.get('/api/races/recent?page=1')
      .then( resp => {
        let recentRaces = resp.data.data.concat();
        this.throttleTimer = null;
        this.throttleDelay = 100;
        window.addEventListener('scroll', this.scrollHandler);
        this.setState({recentRaces: recentRaces, loading: false});
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
    serverReq.get('/api/races/recent?page=' + nextPage)
      .then( resp => {
        let fetchedRaces = this.state.recentRaces.concat(resp.data.data);
        this.setState({recentRaces: fetchedRaces, loading: false, displayPage: nextPage});
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  goToRaceDetailsPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=details'
    })
  }

  goToRaceResultsPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=results'
    })
  }

  goToRacePhotosPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=photos'
    })
  }

  searchRaces = (searchParam) => {
    this.props.history.push('/races/all?search=' + searchParam);
  }

  hideModal = () => {
    this.setState({showModal: false});
  }

  render () {
    return (
      <Aux>
        <Spinner loading={this.state.loading}/>
        <Modal title='Ooops' show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>Error loading races</h2>
        </Modal>
        <div className={styles.RecentRaces}>
          <div className={styles.RacesContainer}>
            {
              this.state.recentRaces.map( el => {
                if(el.racePhotosTabEnabled && el.resultsAvailable){
                  return(
                      <TwoActionCard
                        key={el._id} 
                        cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                        title={el.raceName} 
                        heading1={utils.formatDate(el.raceDate)} 
                        heading2={el.raceAddress}
                        leftActionLabel="RESULTS"
                        leftActionClicked={() => this.goToRaceResultsPage(el.raceNick)}
                        rightActionLabel="PHOTOS"
                        rightActionClicked={() => this.goToRacePhotosPage(el.raceNick)} />
                    );
                }
                else if(!el.racePhotosTabEnabled && el.resultsAvailable){
                  return(
                    <OneActionCard
                      key={el._id} 
                      cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                      title={el.raceName} 
                      heading1={utils.formatDate(el.raceDate)} 
                      heading2={el.raceAddress}
                      actionLabel="RESULTS"
                      actionClicked={() => this.goToRaceResultsPage(el.raceNick) } />
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
                      actionLabel="PHOTOS"
                      actionClicked={() => this.goToRacePhotosPage(el.raceNick) } />
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

export default RecentRaces; 