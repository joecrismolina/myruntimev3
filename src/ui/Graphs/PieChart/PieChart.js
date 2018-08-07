import React, {Component} from 'react';
import {PieChart, Pie, Sector, ResponsiveContainer} from 'recharts';

class ThisPieChart extends Component {

  state = {
    activeIndex: 0
  }

  renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.value + ' ' + payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill='#ff6b24'
          opacity={0.85}
        />
      </g>
    );
  }

  onPieEnter = (data, index) => {
    this.setState({ activeIndex: index });
  }

  render () {
    return (
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie 
            activeIndex={this.state.activeIndex}
            activeShape={this.renderActiveShape} 
            data={this.props.data}
            dataKey={'value'} 
            innerRadius={120}
            outerRadius={140} 
            fill="#1e4d66"
            onMouseEnter={this.onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }
};

export default ThisPieChart;