import React, { Component } from 'react';
import SimpleCard from '../../../ui/Card/SimpleCard/SimpleCard';
import Spinner from '../../../ui/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Modal from '../../../ui/Modal/Modal';
import styles from './NewsFeed.css';
import * as utils from '../../../utils/utils';

import serverReq from '../../../http/serverAxios';

class NewsFeed extends Component {

  state = {
    loading : true,
    feed : [],
    currentPage : 1,
    showModal: false
  }

  componentDidMount () {
    serverReq.get('/api/articles?page=1')
      .then( resp => {
        const allFeed = [...this.state.feed].concat(resp.data.data);
        this.throttleTimer = null;
        this.throttleDelay = 100;
        window.addEventListener('scroll', this.scrollHandler);
        this.setState({feed: allFeed, loading: false, currentPage: 1});
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
    const nextPage = this.state.currentPage + 1;
    this.setState({loading: true});
    serverReq.get('/api/articles?page=' + nextPage)
      .then( resp => {
        if(resp.data.data && resp.data.data.length > 0){
          let allFeed = this.state.feed.concat(resp.data.data);
          this.setState({feed: allFeed, loading: false, currentPage: nextPage});
        }
        else{
          this.setState({loading: false});
        }
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  componentDidUpdate () { }

  hideModal = () => {
    this.setState({showModal: false});
  }

  render () {
    return (
      <Aux>
        <Spinner loading={this.state.loading}/>
        <Modal title='Ooops' show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>Error loading news feed</h2>
        </Modal>
        <div className={styles.NewsFeed}>
          <div className={styles.NewsFeedContainer}>
            {
              this.state.feed.map( el => {
                return (
                  <SimpleCard 
                    key={el._id} 
                    cardImage={'https://myrunti.me/images/' + el.image } 
                    title='' 
                    heading1={el.title} 
                    heading2=''
                    heading3={el.sourceName + ' - ' + utils.formatDate(el.dateAdded)}
                    link={'/news-feed/article?id=' + el._id } />
                )
              })
            }
          </div>
        </div>
      </Aux>
    );
  }
};

export default NewsFeed;