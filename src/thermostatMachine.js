import {Machine} from 'xstate';

const ThermostatMachine = Machine({
  id: 'thermostat',
  initial: 'offMode',
 
states: {
    offMode: {
      on: {
        Default: 'offMode',
        Heating: 'heatingMode',
        Cooling: 'coolingMode'
      }
    },
    heatingMode: {
      on: {
        Default: 'offMode',
        Heating: 'heatingMode',
        Cooling: 'coolingMode'
      }
    }, 
    coolingMode: {
      on: {
        Default: 'offMode',
        Heating: 'heatingMode',
        Cooling: 'coolingMode'
      }
    }
  }
});

  export default ThermostatMachine;