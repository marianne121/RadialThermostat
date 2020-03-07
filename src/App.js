import React from 'react';
import logo from './logo.svg';
import './App.css';
import Scale from './scale.png' 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTemp : '',
      value: 0
    };
  }
  handleChange = newValue => {
    this.setState({
      value: newValue
    });
  };
  handleChangeValue = e => this.setState({currentTemp: e.target.value});

  render () {
    return (
      <div className="App">
        <div className="radial-thermostat">
        <svg width="400" height="400">
        <RadialThermostat/>
        </svg>
          <div className="Dials">
          <TemperatureDials/>
          </div>
          <Knob
          size={300}
          degrees={310}
          min={1}
          max={100}
          value={1}
          color={true}
          onChange={this.handleChange}
        />
          <div className="TargetTemp">
            <TargetTemp/>
          </div>
          <div>
          <TestControls 
          value={this.state.currentTemp}
          onChangeValue={this.handleChangeValue}/>
        </div>
          <div className="CurrentTemp">
            <CurrentTemp currentTemp={this.state.currentTemp}/>
          </div>
          
        </div>
      </div>
    );
  }
 
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
      </React-Fragment>
    )
  }
}

class Knob extends React.Component {
  constructor(props) {
    super(props);
    this.fullAngle = props.degrees;
    this.startAngle = 205;
    this.endAngle = 155;
    this.currentDeg = Math.floor(
      this.getAngle(
        this.fullAngle,
        props.max,
        props.min,
        props.value,
        this.startAngle
      )
    );
    console.log("current deg = " + this.currentDeg);
    console.log("current value "+props.value);
    this.state = { deg: this.currentDeg };
  }

  startDrag = e => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2
    };
    const moveHandler = e => {
      this.currentDeg = this.getDeg(e.clientX, e.clientY, pts);
      // if (this.currentDeg === this.startAngle) this.currentDeg--;
      let newValue = Math.floor(
        this.getValue(
          this.fullAngle,
          this.props.max,
          this.props.min,
          this.currentDeg,
          this.startAngle
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

  getDeg = (cX, cY, pts) => {
    const x = pts.x - cX;
    const y = pts.y - cY;
    // 180/Math.PI helps to convert to degree
    let deg = Math.atan2(y, x) * (180/Math.PI);
    console.log("original degree: "+deg);
    // change start line from bottom vertical axis
    deg = deg-90;

    if(deg<0) {
      deg=360+deg;
   }
   console.log("final deg: "+deg);
   if (155< deg && deg<165) {
     deg=155;
   } else if (165<deg && deg<205){
     console.log("maximum temperature set");
      deg=205;
   }

    console.log(deg);


    return deg;
  };

  getAngle = (fullAngle, maxValue, minValue, currentValue, startAngle) => {
    return (fullAngle / (maxValue-minValue+1)) * (currentValue-1) + startAngle;
  };

  getValue = (fullAngle, maxValue, minValue, currentAngle, startAngle) => {
    return ((maxValue-minValue+1) / fullAngle) * (currentAngle-startAngle);
  };

  render () {
    //`rotate( deg)`
    const styles = {
      transform: "rotate(" +this.state.deg +"deg)",
    }
    return (
      <div>
        <div className="Knob">
        <div className="Indicator" style={styles} onMouseDown={this.startDrag}/>
        </div>
      </div>
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
            type="text"
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
