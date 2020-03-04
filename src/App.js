import React from 'react';
import logo from './logo.svg';
import './App.css';

function App () {
  return (
    <div className="App">
      <header className="App-header">
      <div className="radial-thermostat">
      <svg width="400" height="400">
      <RadialThermostat/>
      <CircularBackground/>
      <ThermostatKnob/>
      </svg>
      </div>
      </header>
    </div>
  )
}
class RadialThermostat extends React.Component{
  render() {
    return (
        <circle cx="205" cy="205" r="175" fill="#f0f0f0"/>
    );
  }
}

class CircularBackground extends React.Component{
  render() {
    return(
        <circle cx="205" cy="205" r="165" fill="#ffffff"/>
    );
  }
}

class ThermostatKnob extends React.Component{
  render() {
    return (
      <circle cx="205" cy="205" r="155" fill="#50505a"/>
    );
  }
}

export default App;
