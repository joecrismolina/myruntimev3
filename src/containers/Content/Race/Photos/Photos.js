import React, { Component } from 'react';
import ResponsiveTable from '../../../../ui/ResponsiveTable/ResponsiveTable';
import SearchBar from '../../../../ui/SearchBar/SearchBar';
import styles from './Photos.css';
import FBShareButton from '../../../../assets/images/fb-share-button.jpg';
import Spinner from '../../../../ui/Spinner/Spinner';
import Modal from '../../../../ui/Modal/Modal';
import Aux from '../../../../hoc/Auxiliary/Auxiliary';
import serverReq from '../../../../http/serverAxios';

class Photos extends Component {

  state = {
    searchResults : [],
    loading : false,
    showModal : false,
    modalTitle : '',
    modalMessage : '',
    showLoginMessageModal : false,
    loginRedirect: ''
  }

  searchPhotosHandler = (searchParam) => {
    this.setState({loading: true, searchResults : []});
    serverReq.get('/api/photos/search?raceNick=' + this.props.race.raceNick + '&search=' + searchParam)
      .then( resp => {
        if(resp.data.data && resp.data.data.length > 0) {
          let allValidTags = [];
          resp.data.data.forEach( d => {
            d.tags.forEach( t => {
              if ((allValidTags.filter( curr => { return curr === t})).length === 0){
                if (t === searchParam || t.includes(searchParam)) allValidTags.push(t);
              }
            })
          })
          const searchResults = allValidTags.map( tag => {
            let resultRow = [];
            resultRow.push({dataLabel: 'Bib', data: tag});
            const refLink = '/results?view=photos&raceId=' + this.props.race._id + '&raceNick=' + this.props.race.raceNick + '&bibnumber=' + tag;
            resultRow.push({dataLabel: '', data: (<a onClick={(event) => this.goToAnalysisPageHandler(event, refLink)} href='/'>View Photos</a>)});
            return resultRow;
          })
          this.setState({searchResults : searchResults, loading: false});
        }
        else {
          this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'No photos found. Photo tagging may still be in progress, come back and search again.'});
        }
      })
      .catch( err => {
        this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error searching photos'});
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

  hideModal = () => {
    this.setState({showModal: false, showLoginMessageModal: false});
  }

  render () {

    const photosTableHeaders = ['Owner', 'Album Name'];
    let photos = [];

    this.props.race.racePhotos.forEach( album => {
      let photosRow = [];
      let albumDetails = (<a href={album.albumAddress}>{album.albumName}</a>)
      photosRow.push({dataLabel: 'Owner', data: album.owner});
      photosRow.push({dataLabel: 'Album Name', data: albumDetails});
      photos.push(photosRow);
    });

    const searchResultsTableHeaders = ['Bib Number', 'Photos'];
    let searchResultsTable = null;
    if(this.state.searchResults.length > 0) {
      searchResultsTable = (
        <ResponsiveTable headers={searchResultsTableHeaders} rows={this.state.searchResults} />
      );
    }

    return (
      <Aux>
        <Spinner loading={this.state.loading} />
        <Modal title={this.state.modalTitle} show={this.state.showModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>{this.state.modalMessage}</p>
        </Modal>
        <Modal title='Ooops' show={this.state.showLoginMessageModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontSize: '1.2em'}}>
            <a href={'/login?redirectedFrom=' + this.state.loginRedirect} style={{color:'#428bca', textDecoration:'none'}}> Login </a> or <a href='/signup' style={{color:'#428bca', textDecoration:'none'}}> Signup </a> to view race analysis and race photos
          </p>
        </Modal>
        <div className={styles.RacePhotos}>
          <div className={styles.TableLabel}>RACE PHOTOS</div>
          <SearchBar placeholder='search bib number' searchHandler={this.searchPhotosHandler} minInputLength='1'/>
          <div style={{margin:'20px 0'}}>
            {searchResultsTable}
          </div>
          <ResponsiveTable headers={photosTableHeaders} rows={photos} />
          <div className={styles.RacePhotosShareButton} onClick={() => this.props.shareViaPageFB('photos')}><img src={FBShareButton} alt='share'/></div>
        </div>
      </Aux>
    );
  }
}

export default Photos;