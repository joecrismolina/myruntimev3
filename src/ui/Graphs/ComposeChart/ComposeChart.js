import React, { Component } from 'react';
import {ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';

class ThisComposeChart extends Component {
  render() {
    return (
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart data={this.props.data} margin={{top: 10, right: 30, left: 10, bottom: 10}}>
            <XAxis dataKey="name" stroke="#1e4d66" tickLine={false} hide={true}/>
            <YAxis stroke="#1e4d66" tickLine={false}/>
            <Tooltip content={<CustomizedLabel />}/>
            <Area type='monotone' dataKey='value' fill='#1e4d66' stroke='#1e4d66'/>
            <Bar dataKey='bar' barSize={15} fill='#ff6b24' />
         </ComposedChart>
      </ResponsiveContainer>
    );
  }
};

class CustomizedLabel extends Component {
  render () {
    const { active } = this.props;
    if(active) {
      let message = null
      if(this.props.payload[0].payload.bar !== 0) message = <p style={{fontFamily:'inherit', fontSize:'1.0em', color:'#ff6b24', fontWeight:'500'}}>You belong in this time range</p>
      return(
          <div style={{border:'none', backgroundColor:'white', padding:'10px', textAlign:'left'}}>
            <p style={{fontFamily:'inherit', fontSize:'0.8em', color:'#1e4d66', fontWeight:'500'}}>Finish time range: {this.props.label}</p>
            <p style={{fontFamily:'inherit', fontSize:'0.8em', color:'black', fontWeight:'500'}}>No. of finishers: {this.props.payload[0].value}</p>
            {message}
          </div>
        );
    }
    else{
      return null;
    }
  }
};

export default ThisComposeChart;