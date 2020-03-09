import {Machine} from 'xstate';

const thermostatMachine = Machine({
    id: 'thermostat',
    initial: 'start',
    states: {
      start: {
        on: {
          Default: 'OffMode',
          Heating: 'HeatingMode',
          Cooling: 'CoolingMode'
        }
      },
      OffMode: {
        on: {
          Default: 'OffMode',
          Heating: 'HeatingMode',
          Cooling: 'CoolingMode'
        }
      },
      HeatingMode: {
        on: {
          Default: 'OffMode',
          Heating: 'HeatingMode',
          Cooling: 'CoolingMode'
        }
      }, 
      CoolingMode: {
        on: {
          Default: 'OffMode',
          Heating: 'HeatingMode',
          Cooling: 'CoolingMode'
        }
      }
    }
  });

  export default thermostatMachine;