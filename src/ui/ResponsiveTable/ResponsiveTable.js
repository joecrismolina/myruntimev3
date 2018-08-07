import React from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import styles from './ResponsiveTable.css';

const responsiveTable = (props) => {

  let tableHeader = null;
  let tableRows = null;

  tableHeader = props.headers.map( el => {
    return (<th key={el}>{el}</th>)
  })

  tableRows = props.rows.map( el => {
    return (
      <tr key={Math.floor(Math.random() * 99999-1) + 1}>
        {
          el.map(rEl => <td key={rEl.dataLabel} data-label={rEl.dataLabel}>{rEl.data}</td>)
        }
      </tr>
    )
  })

  return (
    <Aux>
      <table className={styles.ResponsiveTable}>
        <thead>
          <tr>
            {tableHeader}
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </Aux>
  )
};

export default responsiveTable;
