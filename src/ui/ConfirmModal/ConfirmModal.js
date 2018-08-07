import React from 'react';
import Modal from '../Modal/Modal';
import styles from './ConfirmModal.css';

const confirmModal = (props) => {
  return (
    <Modal title={props.title} show={props.showModal} modalClosed={props.modalClosed} style={{padding: '16px 0 0 0'}}>
      <div className={styles.ConfirmModalMessage}>{props.message}</div>
      <div className={styles.ConfirmModalButtonsContainer}>
        <button className={styles.ConfirmModalCancelButton} onClick={props.onCancel}><i className="material-icons">close</i></button>
        <button className={styles.ConfirmModalSaveButton} onClick={props.onConfirm}><i className="material-icons">check</i></button>
      </div>
    </Modal>
  );
};

export default confirmModal;