import React from 'react';
import logo from './logo.svg';
import './App.css';
import Scale from './scale.png' 

function App () {
  return (
    <div className="App">
      <div className="radial-thermostat">
      <svg width="400" height="400">
      <RadialThermostat/>
      <CircularBackground/>
      
      <ThermostatKnob/>
      </svg>
        <div className="Dials">
        <TemperatureDials/>
        </div>
      </div>
    </div>
  )
}
class RadialThermostat extends React.Component{
  render() {
    return (
        <circle cx="225" cy="225" r="175" fill="#f0f0f0"/>
    );
  }
}

class CircularBackground extends React.Component{
  render() {
    return(
        <circle cx="225" cy="225" r="165" fill="#ffffff"/>
    );
  }
}

class ThermostatKnob extends React.Component{
  render() {
    return (
      
      <React.Fragment>
            <linearGradient id="grayColour">
       <stop offset="0%" stop-color="#353b3f"></stop>
       <stop offset="100%" stop-color="#353b3f"></stop>
    </linearGradient>
    <linearGradient id="gradientColour" >
       <stop offset="0%" stop-color="#4a92d8"></stop>
       <stop offset="100%" stop-color="#e06b71"></stop>
    </linearGradient>
    <path d="
          M140 355 
          A155 155 0 1 1 310 355"
        fill="none" stroke="url(#gradientColour)" stroke-width="6" />
   <path d="M140 355 
        A155 155 0 0 0 310 355"
        fill="none" stroke="url(#grayColour)" stroke-width="6" />
        <circle cx="224.5" cy="225.5" r="152.5" fill="#50505a"/>
      </React.Fragment>
    );
  }
}

class TemperatureDials extends React.Component{
  render() {
    return (
      <img src={Scale} alt="tempScale" width="287" height="287"/>
    )
  }
}

export default App;
