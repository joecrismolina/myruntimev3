import React, { Component } from 'react';
import Backdrop from '../Backdrop/Backdrop';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import styles from './Modal.css';

class Modal extends Component {

  shouldComponentUpdate (nextProps, nextState) {
    return (nextProps.show !== this.props.show || nextProps.children !== this.props.children);
  }

  componentWillUpdate () { }

  render () {
    return (
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
          <div className={styles.Modal}
            style={{
              transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
              opacity: this.props.show ? '1' : '0'
            }}>
            <div className={styles.CloseModal}>
              <div onClick={this.props.modalClosed}>x</div>
            </div>
            <h1 className={styles.ModalTitle}>{this.props.title}</h1>
            { this.props.children }
          </div>
      </Aux>
    )
  }
}

export default Modal;