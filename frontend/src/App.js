import React, { Component } from 'react';
import './App.css';
import background from './background.worker';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import TeamsScreen from './screens/TeamsScreen';
import ScoreboardScreen from './screens/ScoreboardScreen';
import StandingsPage from './screens/StandingsScreen';
import SpecificTeamScreen from './screens/SpecificTeamScreen';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      theme: 'dark'
    };
    this.playerDataThread = background();
  }

  initTasks = () => {
    this.playerDataThread.onmessage = this.workerThreadMessage;
    this.playerDataThread.postMessage({
      message: 'playerPayload'
    })
  }

  componentDidMount = () => {
    this.initTasks();
    window.localStorage.setItem('theme',this.state.theme);
  }

  changeGlobalTheme = () => {
    this.setState(prevState => {
      let old = prevState;
      if(old.theme === 'dark'){
        old.theme = 'light';
        try {
          document.getElementsByClassName("holder")[0].classList.add("light");
        }catch (e) {}
      }else{
        old.theme = 'dark';
        try {
          document.getElementsByClassName("holder")[0].classList.remove("light");
        } catch (e){}
      }
      return Object.assign({},old);
    })
  }

  componentWillUnmount = () => {
    this.playerDataThread.terminate();
  }

  workerThreadMessage = ({ data }) => {
    if(data.type){
      switch(data.type) {
        case 'success':
          window.localStorage.setItem('playerLoaded',true);
          window.localStorage.setItem('player',JSON.stringify(data.payload));
          break;
        case 'default':
          break;
        default:
          break;
      }
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={HomeScreen} />
          <Route path="/teams" exact component={TeamsScreen} />
          <Route path="/scoreboard" exact component={ScoreboardScreen} />
          <Route path="/standings" exact component={StandingsPage} />
          <Route path="/team/:teamID" component={SpecificTeamScreen} />
        </Switch>
      </Router>
    );
  }
}

export default App;
