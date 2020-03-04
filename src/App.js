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
      </svg>
        <div className="Dials">
        <TemperatureDials/>
        </div>
        <div className="TargetTemp">
          <TargetTemp/>
        </div>
        <div className="CurrentTemp">
          <CurrentTemp/>
        </div>
      </div>
    </div>
  )
}
class RadialThermostat extends React.Component{
  render() {
    return (
      <React.Fragment>
        <circle cx="225" cy="225" r="175" fill="#f0f0f0"/>
        <CircularBackground/>
      </React.Fragment>
        
    );
  }
}

class CircularBackground extends React.Component{
  render() {
    return(
      <React.Fragment>
        <circle cx="225" cy="225" r="165" fill="#ffffff"/>
        <ThermostatKnob/>
      </React.Fragment> 
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
      <React-Fragment>
        <img src={Scale} alt="tempScale" width="287" height="287"/>
        <TemperatureIndicator/>
      </React-Fragment>
      
    )
  }
}

class TemperatureIndicator extends React.Component {
  state = {
    value:72
  }
  changeValue(val) {
    this.setState({value:val})
  }
  render() {
    return (
        <div className="tempIndicator"/>
    );
    return (
      <TemperatureIndicator onChange={this.changeValue.bind(this)} min={0} max={100} value={this.state.value}/>
    )
  }
}

class TargetTemp extends React.Component{
  render() {
    return (
        <h1>72</h1>
    )
  }
}

class CurrentTemp extends React.Component{
  render() {
    return (
        <h2>Current: 72</h2>
    )
  }
}

export default App;
