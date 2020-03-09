import React from 'react';
import './App.css';
import Scale from './scale.png';
import TempData from './Model/TemperatureData.model';
import * as DefVals from './DefaultValues.js';
import thermostatMachine from './thermostatMachine.js';
import {interpret} from 'xstate';
import MainPanel from './View/MainPanel.js';
import TestControls from './View/TestControl.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.currentData = new TempData(50, 50, DefVals.off);

    this.state = {
      currentData: this.currentData,
      currentTemp: this.currentData.currentTemp,
      targetTemp: this.currentData.targetTemp,
      mode: this.currentData.mode,
      machine: thermostatMachine.initialState
    }
  }

  // to manage state machine
  service = interpret(thermostatMachine).onTransition(machine=>this.setState({machine}));

  componentDidMount() {
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }

  determineMode = (mode, currentTemp, targetTemp, dT, dTCool, dTHeat) => {
    if(currentTemp > targetTemp + dT + dTCool) { // set blue = #4a92d8
      mode = DefVals.cooling;
    } else if (currentTemp < targetTemp - dT - dTHeat) { // set red = #e06b71
      mode = DefVals.heating;
    } else if (targetTemp - (dT-dTHeat) < currentTemp && // set default gray = #353b3f
    currentTemp < targetTemp + (dT-dTCool)){
      mode = DefVals.off;;
    } 
    return mode;
  };

  // to handle event changes
  handleCurrentChange = (event) => {
    this.setState({currentTemp: event.target.value});
    this.service.send("Cooling"); // Hardcoded value, todo if time permits
  }

  handleTargetChange = (newTarget) => {
    this.setState({targetTemp: newTarget});
    this.service.send("Cooling"); // Hardcoded value, todo if time permits
  }
  
  

  render() {
    // to retrieve mode using xState
    let mode = this.state.machine.value;
    console.log("state machine retrieved: "+mode);
    return(
    <div className="App">
      <MainPanel
      currentTemp={this.state.currentTemp}
      targetTemp={this.state.targetTemp}
      mode={this.state.mode}
      onChange={this.handleTargetChange} />
      <div className="TestControls">
      <TestControls 
        currentTemp={this.state.currentTemp}
        onChangeValue={this.handleCurrentChange}/>
        </div>
      </div> 
      );
    }
}
export default App;
