import React, { Component } from 'react';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Spinner from '../../../ui/Spinner/Spinner';
import OneActionCard from '../../../ui/Card/OneActionCard/OneActionCard';
import TwoActionCard from '../../../ui/Card/TwoActionCard/TwoActionCard';
import Modal from '../../../ui/Modal/Modal';
import SearchBar from '../../../ui/SearchBar/SearchBar';
import MobileFilter from '../../../ui/MobileFilter/MobileFilter';
import styles from './AllRaces.css';
import serverReq from '../../../http/serverAxios';
import * as utils from '../../../utils/utils';

class AllRaces extends Component {

  state = {
    loading: true,
    showModal: false,
    allRaces : [],
    displayPage : 1,
    searchParam : '',
    urlSearchParam : '',
    filters : {
      raceName: '',
      year: 'all',
      month: 'all',
      country: 'Philippines',
      raceType: 'all'
    },
    mobileFilterShown: false
  }

  componentDidMount () {
    let searchParam = '';
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
      if(param[0] === 'search') searchParam = param[1];
    }
    serverReq.get('/api/races/search?page=1&raceName=' + searchParam)
      .then( resp => {
        let allRaces = resp.data.data.concat();
        // handle bottomless scrolling
        this.throttleTimer = null;
        this.throttleDelay = 100;
        window.addEventListener('scroll', this.scrollHandler);
        const filters = {...this.state.filters, raceName: searchParam};
        this.setState({allRaces: allRaces, loading: false, searchParam: searchParam, filters: filters});
      })
      .catch( err => {
        this.setState({loading: false, showModal: true, searchParam: searchParam});
      });
  }

  componentDidUpdate () {
    let urlSearchParam = '';
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
      if(param[0] === 'search') urlSearchParam = param[1];
    }
    if(this.state.urlSearchParam !== urlSearchParam && !this.state.loading){
      this.setState({loading: true});
      serverReq.get('/api/races/search?page=1&raceName=' + urlSearchParam)
        .then( resp => {
          let allRaces = resp.data.data.concat();
          this.setState({allRaces: allRaces, loading: false, urlSearchParam: urlSearchParam});
        })
        .catch( err => {
          this.setState({loading: false, showModal: true, urSearchParam: urlSearchParam});
        });
    }
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
    serverReq.get('/api/races/search?page=' + nextPage + '&' + this.constructSearchQueryFromFilter())
      .then( resp => {
        if(resp.data.data && resp.data.data.length === 0){
          this.setState({loading: false, displayPage: nextPage - 1});
        }
        else{
          let fetchedRaces = this.state.allRaces.concat(resp.data.data);
          this.setState({allRaces: fetchedRaces, loading: false, displayPage: nextPage});
        }
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

  goToRaceRegistrationPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=registration'
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

  searchRaces = (searchParams) => {
    if(this.state.loading) return;
    this.setState({loading: true});
    serverReq.get('/api/races/search?page=1&raceName=' + searchParams)
      .then( resp => {
        if(resp.data.data && resp.data.data.length === 0){
          this.setState({loading: false, displayPage: 1, searchParam: searchParams});
        }
        else{
          let fetchedRaces = resp.data.data.concat();
          this.setState({allRaces: fetchedRaces, loading: false, displayPage: 1, searchParam: searchParams});
        }
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  changeFiltersHandler = (event, filterId) => {
    let updatedFilters = {...this.state.filters}
    updatedFilters[filterId] = event.target.value;
    this.setState({filters: updatedFilters});
  }

  constructSearchQueryFromFilter = () => {
    let query = '';
    if(this.state.filters.raceName !== '') query += ('raceName=' + this.state.filters.raceName);
    query += ('&country=' + this.state.filters.country);
    if(this.state.filters.year !== 'all') query += ('&year=' + this.state.filters.year);
    if(this.state.filters.month !== 'all') query += ('&month=' + this.state.filters.month);
    if(this.state.filters.raceType !== 'all') query += ('&raceType=' + this.state.filters.raceType);
    return query;
  }

  applyFilterAndSearch = () => {
    this.setState({loading: true});
    this.hideMobileFilters();
    serverReq.get('/api/races/search?page=1&' + this.constructSearchQueryFromFilter())
      .then( resp => {
        let fetchedRaces = resp.data.data.concat();
        this.setState({allRaces: fetchedRaces, loading: false, displayPage: 1});
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  hideModal = () => {
    this.setState({showModal: false});
  }

  hideMobileFilters = () => {
    this.setState({mobileFilterShown: false});
  }

  showMobileFilters = () => {
    this.setState({mobileFilterShown: true});
  }

  render () {
    let thisYear = (new Date()).getFullYear();
    let years = [];
    for (let cntr=10; cntr--; cntr>0) {
      years.push(thisYear);
      thisYear--;
    }
    const yearFilterOptions = years.map( el => {
      return (
        <option key={el} value={el}>{el}</option>
      )
    })
    const noRacesMessage = (this.state.allRaces.length === 0 && !this.state.loading) ? <h2 style={{color: '#1e4d66'}}>No races found</h2> : null;
    return (
      <Aux>
        <Spinner loading={this.state.loading}/>
        <Modal title='Ooops' show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>Error loading races</h2>
        </Modal>
        <MobileFilter open={this.state.mobileFilterShown} closed={this.hideMobileFilters}>
          <div className={styles.MobileFilterContainer}>  
            <button className={styles.MobileFilterHideButton} onClick={this.hideMobileFilters}>HIDE FILTERS</button>
            <div className={styles.MobileFilterGroup}>
              <div className={styles.MobileFilterName}>RACE NAME</div>
              <input type='text' value={this.state.filters.raceName} onChange={ (event) => this.changeFiltersHandler(event, 'raceName') } className={styles.MobileFilterInput} placeholder='all races'/>
            </div>
            <div className={styles.MobileFilterGroup}>
              <div className={styles.MobileFilterName}>YEAR</div>
              <select className={styles.MobileFilterSelect} value={this.state.filters.year} onChange={ (event) => this.changeFiltersHandler(event, 'year') }>
                <option value="all">ALL YEARS</option>
                {
                  yearFilterOptions
                }
              </select>
            </div>
            <div className={styles.MobileFilterGroup}>
              <div className={styles.MobileFilterName}>MONTH</div>
              <select className={styles.MobileFilterSelect} value={this.state.filters.month} onChange={ (event) => this.changeFiltersHandler(event, 'month') }>
                <option value="all">ALL MONTHS</option>
                <option value="1">JANUARY</option>
                <option value="2">FEBRUARY</option>
                <option value="3">MARCH</option>
                <option value="4">APRIL</option>
                <option value="5">MAY</option>
                <option value="6">JUNE</option>
                <option value="7">JULY</option>
                <option value="8">AUGUST</option>
                <option value="9">SEPTEMBER</option>
                <option value="10">OCTOBER</option>
                <option value="11">NOVEMBER</option>
                <option value="12">DECEMBER</option>
              </select>
            </div>
            <div className={styles.MobileFilterGroup}>
              <div className={styles.MobileFilterName}>LOCATION</div>
              <select className={styles.MobileFilterSelect} value={this.state.filters.country} onChange={ (event) => this.changeFiltersHandler(event, 'country') }>
                <optgroup label="Asia and Pacific">
                  <option value="Philippines">Philippines</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Australia">Australia</option>
                  <option value="Hong Kong">Hong Kong</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="Uinted Kingdom">United Kingdom</option>
                </optgroup>
                <optgroup label="Americas">
                  <option value="United States">United States</option>
                </optgroup>
              </select>
            </div>
            <div className={styles.MobileFilterGroup}>
              <div className={styles.MobileFilterName}>RACE TYPE</div>
              <select className={styles.MobileFilterSelect} value={this.state.filters.raceType} onChange={ (event) => this.changeFiltersHandler(event, 'raceType') }>
                <option value="all">ALL RACES</option>
                <option value="upcoming">UPCOMING RACES</option>
                <option value="recent">CONCLUDED RACES</option>
              </select>
            </div>
            <button className={styles.MobileFilterApplySearchButton} onClick={this.applyFilterAndSearch}>SEARCH RACES</button>
          </div>
        </MobileFilter>
        <div className={styles.FilterContainer}>
          <h1>FILTER RACES</h1>
          <div className={styles.FilterGroup}>
            <div className={styles.Filter}>
              <div className={styles.FilterName}>RACE NAME</div>
              <input type='text' value={this.state.filters.raceName} onChange={ (event) => this.changeFiltersHandler(event, 'raceName') } className={styles.FilterInput} placeholder='all races'/>
            </div>
            <div className={styles.Filter}>
              <div className={styles.FilterName}>YEAR</div>
              <select className={styles.FilterSelect} value={this.state.filters.year} onChange={ (event) => this.changeFiltersHandler(event, 'year') }>
                <option value="all">ALL YEARS</option>
                {
                  yearFilterOptions
                }
              </select>
            </div>
            <div className={styles.Filter}>
              <div className={styles.FilterName}>MONTH</div>
              <select className={styles.FilterSelect} value={this.state.filters.month} onChange={ (event) => this.changeFiltersHandler(event, 'month') }>
                <option value="all">ALL MONTHS</option>
                <option value="1">JANUARY</option>
                <option value="2">FEBRUARY</option>
                <option value="3">MARCH</option>
                <option value="4">APRIL</option>
                <option value="5">MAY</option>
                <option value="6">JUNE</option>
                <option value="7">JULY</option>
                <option value="8">AUGUST</option>
                <option value="9">SEPTEMBER</option>
                <option value="10">OCTOBER</option>
                <option value="11">NOVEMBER</option>
                <option value="12">DECEMBER</option>
              </select>
            </div>
          </div>
          <div className={styles.FilterGroup}>
            <div className={styles.Filter}>
              <div className={styles.FilterName}>LOCATION</div>
              <select className={styles.FilterSelect} value={this.state.filters.country} onChange={ (event) => this.changeFiltersHandler(event, 'country') }>
                <optgroup label="Asia and Pacific">
                  <option value="Philippines">Philippines</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Australia">Australia</option>
                  <option value="Hong Kong">Hong Kong</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="Uinted Kingdom">United Kingdom</option>
                </optgroup>
                <optgroup label="Americas">
                  <option value="United States">United States</option>
                </optgroup>
              </select>
            </div>
            <div className={styles.Filter}>
              <div className={styles.FilterName}>RACE TYPE</div>
              <select className={styles.FilterSelect} value={this.state.filters.raceType} onChange={ (event) => this.changeFiltersHandler(event, 'raceType') }>
                <option value="all">ALL RACES</option>
                <option value="upcoming">UPCOMING RACES</option>
                <option value="recent">CONCLUDED RACES</option>
              </select>
            </div>
          </div>
          <button className={styles.FilterButton} onClick={this.applyFilterAndSearch} disabled={this.state.loading}>SEARCH</button>
        </div>
        <div className={styles.AllRaces}>
          <div className={styles.AllRacesContainer}>
            {
              noRacesMessage
            }
            {
              this.state.allRaces.map( el => {
                if(!el.published){
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
                }
                else {
                  if(el.racePhotos.length && el.raceResultsTabEnabled){
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
                  else if(!el.racePhotos.length && el.raceResultsTabEnabled) {
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
                        actionLabel="DETAILS"
                        actionClicked={() => this.goToRaceDetailsPage(el.raceNick) } />
                    );
                  }
                }
              })
            }
          </div>
        </div>
        <div className={styles.MobileSearchGroup}>
          <button className={styles.MobileFilterButton} onClick={this.showMobileFilters}>SHOW FILTERS</button>
          <SearchBar placeholder='search races' searchHandler={this.searchRaces} minInputLength='3'/>
        </div>
      </Aux>
    );
  }
};

export default AllRaces;