import React from 'react';
import styles from './FBPhoto.css';
const fbPhoto = (props) => {
  return (
    <iframe 
      className={styles.FbPhotoContainer}
      title={props.src}
      src={'https://www.facebook.com/plugins/post.php?href=' + props.src}
      width="100%" height="502" border="none" overflow="hidden" scrolling="no" frameBorder="0" allowtransparency="true">
    </iframe>
  );
};

export default fbPhoto;