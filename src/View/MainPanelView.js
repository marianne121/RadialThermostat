import React from 'react';
import './MainPanelView.css';
import Scale from '../scale.png';
import TempData from '../Model/ThermostatData.model';
import * as DefVals from '../DefaultValues.js';
import thermostatMachine from '../thermostatMachine.js';
import {interpret} from 'xstate';

class MainPanel extends React.Component {
  constructor(props) {
    super(props);

  }

  // handleTargetChange = (newTarget) => this.setState({targetTemp: newTarget});
  // handleCurrentChange = (event) => this.setState({currentTemp: event.target.value});

  render () {

    return (
      <div className="MainPanel">
        <div className="radial-thermostat">
        <svg width="400" height="400">
        <RadialThermostat
        targetTemp={this.props.targetTemp}
        currentTemp={this.props.currentTemp}
        mode={this.props.mode}/>
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
          targetTemp={this.props.targetTemp}
          onChange={this.props.onChange}
        />
          <div className="TargetTemp">
            <TargetTemp targetTemp={this.props.targetTemp}/>
          </div>
          <div className="CurrentTemp">
            <CurrentTemp 
            currentTemp={this.props.currentTemp}
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
    this.state = { deg: this.currentDeg };
  }

  startDrag = e => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
     
    // coordinates of the center of the knob
    const centerX = knob.left + knob.width / 2;
    const centerY = knob.top + knob.height / 2;

    // To fix custom event if time permits
    // var moveSliderEvent = new CustomEvent('moveSlider', {
    //   detail: {
    //     currentDegree: this.currentDeg,
    //     targetTemp: this.state.newValue
    //   }
    // });
    // document.addEventListener('moveSlider', function(e) {
    //   console.log("Slider event complete");
    //   console.log("Current degrees: " + e.detail.currentDegree);
    //   console.log("Current target temperature: " + e.detail.targetTemp);
    // });
    // document.dispatchEvent(moveSliderEvent);

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
        )
      );
      this.setState({ deg: this.currentDeg });
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

  getValue = (fullAngle, maxValue, minValue, currentAngle, startAngle) => {
    let angleDiff = 0;
    if(currentAngle >= 205) {
      angleDiff = currentAngle - startAngle;
    } else if (currentAngle <= 155) {
      angleDiff = 360-205+currentAngle;
    }
    return ((maxValue-minValue) / fullAngle) * angleDiff + minValue;
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

export default MainPanel;
