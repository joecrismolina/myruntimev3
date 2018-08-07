import React, { Component } from 'react';
import ResponsiveTable from '../../../../ui/ResponsiveTable/ResponsiveTable';
import ProgressiveImage from '../../../../ui/ProgressiveImage/ProgressiveImage';
import SearchBar from '../../../../ui/SearchBar/SearchBar';
import Spinner from '../../../../ui/Spinner/Spinner';
import Modal from '../../../../ui/Modal/Modal';
import styles from './Results.css';
import * as utils from '../../../../utils/utils';
import FBShareButton from '../../../../assets/images/fb-share-button.jpg';
import ActivatedIcon from '../../../../assets/images/activatedicon-1-100x100.png';
import serverReq from '../../../../http/serverAxios';

class Results extends Component {

  state = {
    loading : true,
    results : [],
    searchResults : [],
    waveIdSelected : null,
    waveNameSelected : '',
    showLoginMessageModal : false,
    showModal : false,
    modalTitle : '',
    modalMessage : '',
    loginRedirect: ''
  }

  componentDidMount () {
    serverReq.get('/api/results/race/top?id=' + this.props.race._id + '&waveId=' + this.props.race.waves[0].waveId)
      .then( resp => {
        const waveResults = resp.data.data.map( (result, index) => {
          let resultRow = [];
          resultRow.push({dataLabel: 'Rank', data: index + 1});
          resultRow.push({dataLabel: 'Bib', data: result.bibnumber});
          if(result.activated) resultRow.push({dataLabel: 'Name', data: (<div style={{display:'flex',alignItems:'center'}}><img src={ActivatedIcon} style={{width:'35px', height: '35px'}} alt='activatedicon'/>{utils.nameToProper(result.userId.firstName) + ' ' + utils.nameToProper(result.userId.lastName)}</div>)});
          else resultRow.push({dataLabel: 'Name', data: utils.nameToProper(result.firstName) + ' ' + utils.nameToProper(result.lastName)});
          resultRow.push({dataLabel: 'Gender', data: result.gender.toUpperCase()});
          resultRow.push({dataLabel: 'Gun Time', data: utils.secondsToTimeString(result.gunTime)});
          resultRow.push({dataLabel: 'Chip Time', data: utils.secondsToTimeString(result.chipTime)});
          const refLink = '/results?view=analysis&raceId=' + this.props.race._id + '&raceNick=' + this.props.race.raceNick + '&bibnumber=' + result.bibnumber;
          resultRow.push({dataLabel: '', data: (<a onClick={(event) => this.goToAnalysisPageHandler(event, refLink)} href={'/'}>View Analysis</a>)});
          return resultRow;
        });
         const newResults = [];
         newResults.push({waveId: this.props.race.waves[0].waveId, results: waveResults});
         this.setState({waveIdSelected: this.props.race.waves[0].waveId, waveNameSelected: this.props.race.waves[0].waveName, results: newResults, searchResults: [], loading: false})
      })
      .catch( err => {
        this.setState({loading: false});
      });
  }

  goToAnalysisPageHandler = (event, link) => {
    event.preventDefault();
    if(this.props.authenticatedUser){
      this.props.history.push(link);
    }
    else{
      this.setState({loginRedirect: encodeURIComponent(link), showLoginMessageModal: true});
    }
  }

  waveSelectedHandler = (event) => {
    const waveId = event.target.value;
    let waveName = '';
    this.props.race.waves.forEach(wave => {
      if(wave.waveId === parseInt(waveId, 10)) waveName = wave.waveName;
    })
    if(this.state.waveIdSelected.toString() === waveId) {
      return;
    }
    else {
      const allResults = this.state.results.concat();
      let resultsPreviouslyLoaded = false;
      allResults.forEach( results => {
        if(results.waveId.toString() === waveId) resultsPreviouslyLoaded = true;
      });
      if(resultsPreviouslyLoaded) {
        this.setState({waveIdSelected: parseInt(waveId, 10), waveNameSelected: waveName, loading: false, searchResults: []});
        return;
      }
      else{
        this.setState({loading: true});
        serverReq.get('/api/results/race/top?id=' + this.props.race._id + '&waveId=' + waveId)
          .then( resp => {
            const waveResults = resp.data.data.map( (result, index) => {
              let resultRow = [];
              resultRow.push({dataLabel: 'Rank', data: index + 1});
              resultRow.push({dataLabel: 'Bib', data: result.bibnumber});
              if(result.activated) resultRow.push({dataLabel: 'Name', data: ( <div style={{display:'flex',alignItems:'center'}}><img src={ActivatedIcon} style={{width:'35px', height: '35px'}} alt='activatedicon'/>{utils.nameToProper(result.userId.firstName) + ' ' + utils.nameToProper(result.userId.lastName)}</div>)});
              else resultRow.push({dataLabel: 'Name', data: utils.nameToProper(result.firstName) + ' ' + utils.nameToProper(result.lastName)});
              resultRow.push({dataLabel: 'Gender', data: result.gender.toUpperCase()});
              resultRow.push({dataLabel: 'Gun Time', data: utils.secondsToTimeString(result.gunTime)});
              resultRow.push({dataLabel: 'Chip Time', data: utils.secondsToTimeString(result.chipTime)});
              const refLink = '/results?view=analysis&raceId=' + this.props.race._id + '&raceNick=' + this.props.race.raceNick + '&bibnumber=' + result.bibnumber;
              resultRow.push({dataLabel: '', data: (<a onClick={(event) => this.goToAnalysisPageHandler(event, refLink)} href={'/'}>View Analysis</a>)});
              return resultRow;
            });
            let newResults = this.state.results.concat({waveId: parseInt(waveId, 10), results: waveResults});
            this.setState({waveIdSelected: parseInt(waveId, 10), waveNameSelected: waveName, results: newResults, searchResults: [], loading: false});
          })
          .catch( err => {
            this.setState({loading: false});
          });
      }
    }
  }

  searchResultsHandler = (searchParams) => {
    this.setState({loading: true});
    serverReq.get('/api/results/search?id=' + this.props.race._id + '&search=' + searchParams)
      .then( resp => {
        const searchResults = resp.data.data.map( (result, index) => {
          let resultRow = [];
          resultRow.push({dataLabel: 'Bib', data: result.bibnumber});
          if(result.activated) resultRow.push({dataLabel: 'Name', data: ( <div style={{display:'flex',alignItems:'center'}}><img src={ActivatedIcon} style={{width:'35px', height: '35px'}} alt='activatedicon'/>{utils.nameToProper(result.userId.firstName) + ' ' + utils.nameToProper(result.userId.lastName)}</div>)});
          else resultRow.push({dataLabel: 'Name', data: utils.nameToProper(result.firstName) + ' ' + utils.nameToProper(result.lastName)});
          resultRow.push({dataLabel: 'Gender', data: result.gender.toUpperCase()});
          resultRow.push({dataLabel: 'Gun Time', data: utils.secondsToTimeString(result.gunTime)});
          resultRow.push({dataLabel: 'Chip Time', data: utils.secondsToTimeString(result.chipTime)});
          const refLink = '/results?view=analysis&raceId=' + this.props.race._id + '&raceNick=' + this.props.race.raceNick + '&bibnumber=' + result.bibnumber;
          resultRow.push({dataLabel: '', data: (<a onClick={(event) => this.goToAnalysisPageHandler(event, refLink)} href={'/'}>View Analysis</a>)});
          return resultRow;
        });
         if(searchResults.length === 0) {
           this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'No results found'});
         }
         else {
          this.setState({searchResults: searchResults, loading: false});
         }
      })
      .catch( err => {
        this.setState({loading: false});
      });
  }

  hideModal = () => {
    this.setState({showLoginMessageModal: false, showModal: false});
  }

  render () {

    let waveOptions = null;
    waveOptions = this.props.race.waves.map( wave => {
      return(
        <option key={wave.waveId} value={wave.waveId}>{wave.waveName}</option>
      );
    });

    let resultsTableHeaders = ['RANK', 'BIB', 'NAME', 'GENDER', 'GUN TIME', 'CHIP TIME', ''];
    const resultsToShow = this.state.results.filter( result => {
      return (result.waveId === this.state.waveIdSelected) 
    });

    let table = null;
    let tableLabel = '';
    if(resultsToShow.length > 0) {
      table = <ResponsiveTable headers={resultsTableHeaders} rows={resultsToShow[0].results}/>
      tableLabel = this.state.waveNameSelected + ' Top Finishers';
    }

    if(this.state.searchResults.length > 0) {
      resultsTableHeaders = ['BIB', 'NAME', 'GENDER', 'GUN TIME', 'CHIP TIME', ''];
      table = <ResponsiveTable headers={resultsTableHeaders} rows={this.state.searchResults}/>
      tableLabel = 'Search Results';
    }

    return (
      <div className={styles.Results}>
        <Spinner loading={this.state.loading} />
        <Modal title='Ooops' show={this.state.showLoginMessageModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontSize: '1.2em'}}>
            <a href={'/login?redirectedFrom=' + this.state.loginRedirect} style={{color:'#428bca', textDecoration:'none'}}> Login </a> or <a href='/signup' style={{color:'#428bca', textDecoration:'none'}}> Signup </a> to view race analysis and race photos
          </p>
        </Modal>
        <Modal title={this.state.modalTitle} show={this.state.showModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontSize: '1.2em'}}>{this.state.modalMessage}</p>
        </Modal>
        <div className={styles.RaceBanner}>
          <ProgressiveImage src={'https://myrunti.me/images/' + this.props.race.racePhoto} alt='race banner'/>
        </div>
        <div className={styles.ResultsContainer}>
          <SearchBar placeholder='search bib number or runner name' searchHandler={this.searchResultsHandler} minInputLength='1'/>
          <div className={styles.WaveSelect}>
            <select value={this.state.waveIdSelected || '--'} onChange={(event) => this.waveSelectedHandler(event)}>
              {waveOptions}
            </select>
          </div>
          <div className={styles.TableLabel}>{tableLabel}</div>
          {table}
          <div className={styles.RaceResultsShareButton} onClick={() => this.props.shareViaPageFB('results')}><img src={FBShareButton} alt='share'/></div>
        </div>
      </div>
    );
  }
};

export default Results;