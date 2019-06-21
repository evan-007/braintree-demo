import React, { Component } from 'react';
import logo from './logo.svg';
import Braintree from './Braintree';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Braintree />
      </div>
    );
  }
}

export default App;
