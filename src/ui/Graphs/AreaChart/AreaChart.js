import React, { Component } from 'react';
import {AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';

class ThisAreaChart extends Component {

  gradientOffset = (data) => {
      const dataMax = Math.max(...data.map((i) => i.value));
      const dataMin = Math.min(...data.map((i) => i.value));
      if (dataMax <= 0){
        return 0
      }
      else if (dataMin >= 0){
        return 1
      }
      else{
        return dataMax / (dataMax - dataMin);
      }
  }

  render () {
    
    return (
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={this.props.data}
          margin={{top: 10, right: 30, left: 10, bottom: 10}}
        >
          <XAxis dataKey="name" type='number' stroke="#1e4d66" tickLine={false} domain={['dataMin', 'dataMax']}/>
          <YAxis dataKey="value" stroke="#1e4d66" tickLine={false}/>
          <Tooltip content={<CustomizedLabel />}/>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={this.gradientOffset(this.props.data)} stopColor="red" stopOpacity={1}/>
              <stop offset={this.gradientOffset(this.props.data)} stopColor="green" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke="#1e4d66" fill="url(#splitColor)"/>
        </AreaChart>
      </ResponsiveContainer>
    );
  }
};

class CustomizedLabel extends Component {
  render () {
    const { active } = this.props;
    if(active) {
      let message = null;
      if(this.props.payload[0].payload.value > 0) {
        message = <p style={{fontFamily:'inherit', fontSize:'0.8em', color:'red', fontWeight:'500'}}>Ave Pace Diff: + {this.props.payload[0].payload.value} (min/KM)</p>
      }
      else {
        message = <p style={{fontFamily:'inherit', fontSize:'0.8em', color:'green', fontWeight:'500'}}>Ave Pace Diff: {this.props.payload[0].payload.value} (min/KM)</p>
      }
      return(
          <div style={{border:'none', backgroundColor:'white', padding:'10px', textAlign:'left'}}>
            <p style={{fontFamily:'inherit', fontSize:'0.8em', color:'#1e4d66', fontWeight:'500'}}>Distance: {this.props.label}(KM)</p>
            <p style={{fontFamily:'inherit', fontSize:'0.8em', color:'black', fontWeight:'500'}}>Pace: {this.props.payload[0].payload.value + this.props.payload[0].payload.ave} (min/KM)</p>
            {message}
          </div>
        );
    }
    else{
      return null;
    }
  }
};

export default ThisAreaChart;
