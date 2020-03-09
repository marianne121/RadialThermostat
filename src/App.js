import React from 'react';
import './App.css';
import Scale from './scale.png';
import TempData from './Model/ThermostatData.model';
import * as DefVals from './DefaultValues.js';
import thermostatMachine from './thermostatMachine.js';
import {interpret} from 'xstate';
import MainPanel from './View/MainPanelView.js';
import ThermostatData from './Model/ThermostatData.model';
import TestControls from './View/TestControlView.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.currentData = new TempData(66, 50, DefVals.off);

    this.state = {
      currentTemp: this.currentData.currentTemp,
      targetTemp: this.currentData.targetTemp,
      mode: this.currentData.mode,
      machine: thermostatMachine.initialState
    }
  }

      //    if (this.state.mode === DefVals.cooling) {
    //   this.service.send("CoolingMode");
    // } else if (this.state.mode === DefVals.heating) {
    //   this.service.send("HeatingMode");
    // } else if (this.state.mode === DefVals.off) {
    //   this.service.send("OffMode");
    // }

  // to manage state machine
  service = interpret(thermostatMachine).onTransition(machine=>this.setState({machine}));

  componentDidMount() {
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }

  handleCurrentChange = (event) => {
    this.setState({currentTemp: event.target.value});
    this.service.send("Cooling");
  }

  handleTargetChange = (newTarget) => {
    this.setState({targetTemp: newTarget});
    this.service.send("Cooling");
  }

  render() {
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
