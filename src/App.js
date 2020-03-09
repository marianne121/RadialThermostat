import React from 'react';
import './App.css';
import Scale from './scale.png' 
import TempData from './Model/ThermostatData.model'
import * as DefVals from './DefaultValues.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.currentData = new TempData(66, 50, DefVals.off);
    this.state = {
      currentTemp : this.currentData.currentTemp,
      targetTemp: this.currentData.targetTemp,
      mode: this.currentData.mode
    };
  }

  handleTargetChange = (newTarget) => this.setState({targetTemp: newTarget});
  handleCurrentChange = (event) => this.setState({currentTemp: event.target.value});

  render () {
    return (
      <div className="MainPanel">
        <div className="radial-thermostat">
        <svg width="400" height="400">
        <RadialThermostat
        targetTemp={this.state.targetTemp}
        currentTemp={this.state.currentTemp}
        mode={this.state.mode}/>
        </svg>
          <div className="Dials">
          <TemperatureDials/>
          </div>
          <TemperatureIndicator
          totalDeg={DefVals.totalDegrees}
          startAngle={DefVals.startingDegree}
          endAngle={DefVals.endingDegree}
          minTemp={DefVals.minTargetTemp}
          maxTemp={DefVals.maxTargetTemp}
          targetTemp={this.currentData.targetTemp}
          onChange={this.handleTargetChange}
        />
          <div className="TargetTemp">
            <TargetTemp targetTemp={this.state.targetTemp}/>
          </div>
          <div>
          <div className="TestControls">
          <TestControls 
          value={this.state.currentTemp}
          onChangeValue={this.handleCurrentChange}/>
          </div>
          
        </div>
          <div className="CurrentTemp">
            <CurrentTemp 
            currentTemp={this.state.currentTemp}
            />
          </div>
          
        </div>
      </div>
    );
  }
 
}

class RadialThermostat extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <circle cx="225" cy="225" r="175" fill="#f0f0f0"/>
        <CircularBackground
        targetTemp={this.props.targetTemp}
        currentTemp={this.props.currentTemp}
        mode={this.props.mode}
        />
      </React.Fragment>
        
    );
  }
}

class CircularBackground extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <React.Fragment>
        <circle cx="225" cy="225" r="165" fill="#ffffff"/>
        <ThermostatKnob
         targetTemp={this.props.targetTemp}
         currentTemp={this.props.currentTemp}
         mode={this.props.mode}
        />
      </React.Fragment> 
    );
  }
}

class ThermostatKnob extends React.Component{
  constructor(props) {
    super(props);
  }

  updateMode = (currentTemp, targetTemp, mode) => {
    let dT = DefVals.dT;
    let dTCool = DefVals.dTCool;
    let dTHeat = DefVals.dTHeat;

    console.log("Target temp is : " + targetTemp + " & current temp is : " + currentTemp);
    let value = targetTemp+dT+dTHeat;
    console.log(value);
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

  setColour = (mode) => {
    let colour;
    if(mode===DefVals.cooling) {
      colour = "#4a92d8";
    } else if (mode===DefVals.heating) {
      colour = "#e06b71";
    } else if(mode===DefVals.off) {
      colour = "#353b3f";
    }
    return colour;
  }

  render() { 
    let newMode = this.updateMode(this.props.currentTemp, this.props.targetTemp, this.props.mode);
    let newColour = this.setColour(newMode);
    console.log("this is the new mode: " + newMode);
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
        <circle cx="224.5" cy="225.5" r="152.5" fill={newColour}/>      
      </React.Fragment>
    );
  }
}

class TemperatureDials extends React.Component{
  render() {
    return (
      <React-Fragment>
        <img src={Scale} alt="tempScale" width="287" height="287"/>
      </React-Fragment>
    )
  }
}


class TemperatureIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.fullAngle = props.totalDeg;
    this.startAngle = props.startAngle;
    this.endAngle = props.endAngle;
    this.maxTemp = props.maxTemp;
    this.minTemp = props.minTemp;
    this.currentDeg = Math.floor(
      this.getAngle(
        this.fullAngle,
        this.maxTemp,
        this.minTemp,
        props.targetTemp,
        this.startAngle
      )
    );
    console.log("current deg = " + this.currentDeg);
    console.log("current value "+props.targetTemp);
    this.state = { deg: this.currentDeg };
  }

  startDrag = e => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
     
    // coordinates of the center of the knob
    const centerX = knob.left + knob.width / 2;
    const centerY = knob.top + knob.height / 2;

    const moveHandler = e => {
      this.currentDeg = this.getDeg(e.clientX, e.clientY, centerX, centerY);
      let newValue = Math.floor(
        this.getValue(
          this.fullAngle,
          this.maxTemp,
          this.minTemp,
          this.currentDeg,
          this.startAngle,
          this.endAngle,
          this.props.targetTemp
        )
      );
      this.setState({ deg: this.currentDeg });
      console.log("new value: "+newValue);
      this.props.onChange(newValue);
    };
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", e => {
      document.removeEventListener("mousemove", moveHandler);
    });
  };

  getDeg = (clickX, clickY, centerX, centerY) => {
    const lengthX = centerX - clickX;
    const lengthY = centerY - clickY;

    // 180/Math.PI helps to convert to degree
    let deg = Math.atan2(lengthY, lengthX) * (180/Math.PI);
    console.log("original degree: "+deg);
    
    // angle translation
    deg = 270+deg;
    if(deg>360) {
      deg = deg-360;
    }

   console.log("final deg: "+deg);
   let middle = (this.startAngle-this.endAngle)/2 + this.endAngle;
   console.log("mid is: "+middle);
   if (this.endAngle<deg && deg<=middle) {
     deg=this.endAngle;
   } else if (middle<=deg && deg<this.startAngle){
     console.log("maximum temperature set");
      deg=this.startAngle;
   }

    console.log(deg);
    return deg;
  };

  getAngle = (fullAngle, maxValue, minValue, currentValue, startAngle) => {
    return (fullAngle / (maxValue-minValue+1)) * (currentValue-minValue) + startAngle;
  };

  getValue = (fullAngle, maxValue, minValue, currentAngle, startAngle, endAngle, oldValue) => {
    let angleDiff = 0;
    if(currentAngle >= 205) {
      console.log("current angle: "+currentAngle);
      angleDiff = currentAngle - startAngle;
    } else if (currentAngle <= 155) {
      console.log("current Angle :" + currentAngle);
      angleDiff = 360-205+currentAngle;
    }
    return ((maxValue-minValue) / fullAngle) * angleDiff + oldValue;
  };

  render () {
    const styles = {
      transform: "rotate(" +this.state.deg +"deg)",
    }
    return (
      <div>
        <div className="TemperatureIndicator">
        <div className="Pointer" style={styles} onMouseDown={this.startDrag}/>
        </div>
      </div>
    )
  }
}

class TargetTemp extends React.Component{
  render() {
    return (
        <h1>{this.props.targetTemp}</h1>
    )
  }
}

class CurrentTemp extends React.Component{

  render() {
    return (
        <h2>Current: {this.props.currentTemp}</h2>
    )
  }
}

class TestControls extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <form>
          <label htmlFor="currentTemp">Set Current Temperature: </label>
          <input 
            type="range"
            min="32"
            max="100"
            name="currentTemp"
            value={this.props.currentTemp}
            onChange={this.props.onChangeValue}
            />
        </form>
      </div>
    );
  }
}

export default App;
