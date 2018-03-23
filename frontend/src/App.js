import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import background from './background.worker';
class App extends Component {

  constructor(props) {
    super(props);
    this.backgroundWorker = background();
    console.log(this.backgroundWorker);
  }

  componentDidMount = () => {
    console.time("fetch players");
    axios.get("http://nba-fetch.southeastasia.cloudapp.azure.com/api/v1/players").then(res => {
      console.timeEnd("fetch players");
      console.log(res.data);
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
