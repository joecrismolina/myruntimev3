import React from 'react';
import Aux from '../../../../hoc/Auxiliary/Auxiliary';
import Graphs from '../../../../ui/Graphs/Graphs';
import styles from './Metrics.css';
import * as utils from '../../../../utils/utils';

const metrics = (props) => {

  if(props.raceAnalysis && props.runnerAnalysis && props.results){
    const gunTimeDescription = 'Gun time is the time from the race start signal until the runner crosses the finish line. This is used as the official time and is used to establish the award winners and order of finish for all runners.';
    const chipTimeDescription = 'Chip time is measured from the time the participant crosses the starting line until reaching the finish line. These times are provided for your information only and are not used to determine order of finish. The chip time is also the more accurate reflection of your race performance as it takes into consideration the delay between the start of the race and the time that you actually crossed the starting line. Because of this, personal records (PRs) are based on Chip Time.';
    const splitsDescription = 'This shows how your average pace per split compares to your overall pace';
    const finishersDescription = 'This shows the distribution of finishers over time.';

    let totalWaveDistance = 0;
    let totalRunners = 0;
    let totalSameGenderRunners = 0;
    let runnerGender = 'Male';
    let waveGunTimeDistribution = [];
    let waveChipTimeDistribution = [];
    props.raceAnalysis.forEach( r => {
      if(r.waveId === props.results.waveId) {
        totalWaveDistance = r.waveDistance;
        totalRunners = r.maleRunners + r.femaleRunners;
        waveGunTimeDistribution = r.gunOverallBin;
        waveChipTimeDistribution = r.chipOverallBin;
        if(props.results.activated){
          if(utils.formatGender(props.results.userId.gender) === 'male') totalSameGenderRunners = r.maleRunners;
          else {
            totalSameGenderRunners = r.femaleRunners;
            runnerGender = 'Female';
          }
        }
        else{
          if(utils.formatGender(props.results.gender) === 'male') totalSameGenderRunners = r.maleRunners;
          else {
            totalSameGenderRunners = r.femaleRunners;
            runnerGender = 'Female';
          }
        }
      }
    });

    const gunTimeGraphs = [
      {data: [{name: 'Finished before you', value: props.runnerAnalysis.overallByGunTime.rank - 1}, {name: 'Finished after you', value: totalRunners - props.runnerAnalysis.overallByGunTime.rank}], title: 'Overall Performance', type: 'pie'},
      {data: [{name: runnerGender + 's finished before you', value: props.runnerAnalysis.genderByGunTime.rank - 1}, {name: runnerGender + 's finished after you', value: totalSameGenderRunners - props.runnerAnalysis.genderByGunTime.rank}], title: 'Gender Performance', type: 'pie'}
    ];

    const chipTimeGraphs = [
      {data: [{name: 'Finished before you', value: props.runnerAnalysis.overallByChipTime.rank - 1}, {name: 'Finished after you', value: totalRunners - props.runnerAnalysis.overallByChipTime.rank}], title: 'Overall Performance', type: 'pie'},
      {data: [{name: runnerGender + 's finished before you', value: props.runnerAnalysis.genderByChipTime.rank - 1}, {name: runnerGender + 's finished after you', value: totalSameGenderRunners - props.runnerAnalysis.genderByChipTime.rank}], title: 'Gender Performance', type: 'pie'}
    ];

    let splitsGraph = null;
    if(props.results.sectorTimes.length > 0) {

      const avePace = parseFloat((((props.results.gunTime * 1000.0)/(totalWaveDistance))/60.0).toFixed(2));
      let currentDistance = 0;
      
      const splitsData = [{name: 0, value: 0, ave: avePace}].concat(props.results.sectorTimes.map ( r => {
        currentDistance += r.sectorLength;
        const thisStart = new Date(r.sectorStart);
        const thisEnd = new Date(r.sectorEnd);
        const totalSeconds = (thisEnd.getTime() - thisStart.getTime()) / 1000;
        const sectorPace = parseFloat((((totalSeconds * 1000.0)/(r.sectorLength))/60.0).toFixed(2));
        return (
          {
            name: parseFloat((currentDistance / 1000.0).toFixed(2)),
            value: parseFloat((sectorPace - avePace).toFixed(2)),
            ave: avePace
          }
        )
      }))

      const splitsGraphData = [
        { data: splitsData, title: 'Splits Performance', type: 'area'}
      ];

      splitsGraph = <Graphs title='SPLITS PERFORMANCE' description={splitsDescription} graphs={splitsGraphData}/>;
    
    }

    let finishersDataByGunTime = waveGunTimeDistribution.map( (bin, index) => {
      return (
        {
          name: utils.secondsToTimeString(bin.start) + ' - ' + utils.secondsToTimeString(bin.end),
          value: bin.count,
          bar: (index === props.runnerAnalysis.overallByGunTime.binIndex ? bin.count : 0),
        }
      )
    })

    let finishersDataByChipTime = waveChipTimeDistribution.map( (bin, index) => {
      return (
        {
          name: utils.secondsToTimeString(bin.start) + ' - ' + utils.secondsToTimeString(bin.end),
          value: bin.count,
          bar: (index === props.runnerAnalysis.overallByChipTime.binIndex ? bin.count : 0),
        }
      )
    })
    
    const finishersGraphs = [
      {data: finishersDataByGunTime, title: 'Finishers by Gun Time', type: 'compose' },
      {data: finishersDataByChipTime, title: 'Finishers by Chip Time', type: 'compose' }
    ];

    return (
      <Aux>
        <div className={styles.AllMetricsContainer}>
          <Graphs title='GUN TIME PERFORMANCE' description={gunTimeDescription} graphs={gunTimeGraphs}/>
          <Graphs title='CHIP TIME PERFORMANCE' description={chipTimeDescription} graphs={chipTimeGraphs}/>
          {splitsGraph}
          <Graphs title='FINISHERS DISTRIBUTION' description={finishersDescription} graphs={finishersGraphs}/>
        </div>
      </Aux>
    );
  }
  else{
    return null;
  }
};

export default metrics;