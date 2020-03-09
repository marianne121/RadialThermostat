import React from 'react';

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

  export default TestControls;