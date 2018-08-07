import React, { Component } from 'react';
import PieChart from './PieChart/PieChart';
import AreaChart from './AreaChart/AreaChart';
import ComposeChart from './ComposeChart/ComposeChart';
import styles from './Graphs.css';

class Graphs extends Component {

  state = {
    graphInView : 0,
    numberOfGraphs : 0,
    leftNavigate: ["material-icons", styles.GraphNavigateLeft, styles.GraphNavigateDisabled],
    rightNavigate: ["material-icons", styles.GraphNavigateRight]
  }

  componentDidMount () {
    if(this.props.graphs.length === 1) {
      this.setState({leftNavigate:[styles.GraphNavigateHidden] , rightNavigate: [styles.GraphNavigateHidden], numberOfGraphs: 1});
    }
    else {
      this.setState({numberOfGraphs: this.props.graphs.length}); 
    }
  }

  navigationHandler = (identifier) => {
    if(identifier === 'left') {
      if(this.state.graphInView === 0) return;
      else{
        const newGraphInView = this.state.graphInView - 1;
        if(newGraphInView === 0) {
          const newLeftNavigate = ["material-icons", styles.GraphNavigateLeft, styles.GraphNavigateDisabled];
          const rightNavigate = ["material-icons", styles.GraphNavigateRight];
          this.setState({leftNavigate: newLeftNavigate, rightNavigate: rightNavigate, graphInView: newGraphInView});
        }
        else {
          const newLeftNavigate = ["material-icons", styles.GraphNavigateLeft];
          const rightNavigate = ["material-icons", styles.GraphNavigateRight];
          this.setState({leftNavigate: newLeftNavigate, rightNavigate: rightNavigate, graphInView: newGraphInView});
        }
      }
    }
    else {
      if(this.state.graphInView === (this.state.numberOfGraphs - 1)) return;
      else{
        const newGraphInView = this.state.graphInView + 1;
        if(newGraphInView === (this.state.numberOfGraphs - 1)) {
          const newRightNavigate = ["material-icons", styles.GraphNavigateRight, styles.GraphNavigateDisabled];
          const leftNavigate = ["material-icons", styles.GraphNavigateLeft];
          this.setState({rightNavigate: newRightNavigate, leftNavigate: leftNavigate, graphInView: newGraphInView});
        }
        else {
          const newRightNavigate = ["material-icons", styles.GraphNavigateRight];
          const leftNavigate = ["material-icons", styles.GraphNavigateLeft];
          this.setState({rightNavigate: newRightNavigate, leftNavigate: leftNavigate, graphInView: newGraphInView});
        }
      }
    }
  }

  render () {

    let currentGraph = null;
    if(this.props.graphs[this.state.graphInView].type === 'pie'){
      currentGraph = <PieChart data={this.props.graphs[this.state.graphInView].data} />
    }
    else if(this.props.graphs[this.state.graphInView].type === 'compose'){
      currentGraph = <ComposeChart data={this.props.graphs[this.state.graphInView].data} />
    }
    else {
      currentGraph = <AreaChart data={this.props.graphs[this.state.graphInView].data} />
    }

    return (
      <div className={styles.GraphContainer}>
        <div className={styles.GraphTitle}>{this.props.title}</div>
        <div className={styles.GraphSubtitle}>{this.props.graphs[this.state.graphInView].title}</div>
        <div className={styles.GraphContent}>
          <i className={this.state.leftNavigate.join(' ')} onClick={() => this.navigationHandler('left')}>chevron_left</i>
          { currentGraph }
          <i className={this.state.rightNavigate.join(' ')} onClick={() => this.navigationHandler('right')}>chevron_right</i>
        </div>
        <div className={styles.GraphDescription}>{this.props.description}</div>
      </div>
    );
  }
};

export default Graphs;