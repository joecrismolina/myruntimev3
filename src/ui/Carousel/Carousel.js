import React, { Component } from 'react';
import styles from './Carousel.css'
import ProgressiveImage from '../ProgressiveImage/ProgressiveImage';

class Carousel extends Component {

  state = {
    activeIndex : -1,
    numberOfElements: 0,
  }

  componentDidMount () {
    if (this.props.items && this.props.items.length > 0) {
      this.setState({
        activeIndex: 0,
        numberOfElements: this.props.items.length
      });
    }

    this.carouselTimer = setInterval( () => {
      let newActiveIndex = this.state.activeIndex + 1
      if(newActiveIndex === this.state.numberOfElements) newActiveIndex = 0;
      this.setState({activeIndex: newActiveIndex});
    }, 15000);

  }

  componentWillUnmount () {
    clearInterval(this.carouselTimer);
  }

  render () {
    let elementToRender = null;
    if (this.state.numberOfElements > 0) {
      elementToRender = (
          <div className={styles.Carousel}>
            {
                this.props.items.map( (el, index) => {
                let className = null;
                if(index === this.state.activeIndex) className = styles.Active;
                else className = styles.Hidden;
                return (
                  <div className={className} key={el.label}>
                    <ProgressiveImage src={el.image} preview={el.previewImage} alt={el.label}/>
                  </div>
                )
              })
            }
          </div>
      );
    }
    return (
      <div>
        { elementToRender }
      </div>
    );
  }
}

export default Carousel;