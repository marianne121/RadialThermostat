import React from 'react';
import * as DefVals from '../DefaultValues.js';

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
              name="currentTemp"
              min={DefVals.minCurrentTemp}
              max={DefVals.maxCurrentTemp}
              value={this.props.currentTemp}
              onChange={this.props.onChangeValue}
              />
          </form>
        </div>
      );
    }
  }

  export default TestControls;