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
          numTicks={25}
          degrees={260}
          min={1}
          max={100}
          value={30}
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
    this.startAngle = (360 - props.degrees) / 2;
    this.endAngle = this.startAngle + props.degrees;
    this.margin = props.size * 0.15;
    this.currentDeg = Math.floor(
      this.convertRange(
        props.min,
        props.max,
        this.startAngle,
        this.endAngle,
        props.value
      )
    );
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
      if (this.currentDeg === this.startAngle) this.currentDeg--;
      let newValue = Math.floor(
        this.convertRange(
          this.startAngle,
          this.endAngle,
          this.props.min,
          this.props.max,
          this.currentDeg
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

  getDeg = (cX, cY, pts) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = Math.atan(y / x) * 180 / Math.PI;
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg += 270;
    }
    let finalDeg = Math.min(Math.max(this.startAngle, deg), this.endAngle);
    return finalDeg;
  };

  convertRange = (oldMin, oldMax, newMin, newMax, oldValue) => {
    return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
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
