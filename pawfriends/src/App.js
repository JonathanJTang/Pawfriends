import React from 'react';
import './App.css';

import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';

// Temporary: import various components so we can work on them
import Login from './components/Login';
import Registration from './components/Registration';
import Home from './components/Home';
import Posts from './components/Posts';
import Trade from './components/Trade';
import Caretakers from './components/Caretakers';
import Settings from './components/Settings';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';



class App extends React.Component {
  // Global state passed to all components of the app
  state = {

  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path='/Login' render={() => (<Login appState={this.state}/>)} />
            <Route exact path='/Registration' render={() => (<Registration appState={this.state}/>)} />
            <Route exact path='/Home' render={() => (<Home appState={this.state}/>)} />
            <Route exact path='/Posts' render={() => (<Posts appState={this.state}/>)} />
            <Route exact path='/Trade' render={() => (<Trade appState={this.state}/>)} />
            <Route exact path='/Caretakers' render={() => (<Caretakers appState={this.state}/>)} />
            <Route exact path='/Settings' render={() => (<Settings appState={this.state}/>)} />
            <Route exact path='/Profile' render={() => (<Profile appState={this.state}/>)} />
            <Route exact path='/AdminDashboard' render={() => (<AdminDashboard appState={this.state}/>)} />
            <Route path='/' render={() => (
              <div>
                <header>Temporary Redirection page for development</header>
                <Link className="testLink" to={"/Login"}>
                  <input type="button" value="Login"></input>
                </Link>
                <Link className="testLink" to={"/Registration"}>
                  <input type="button" value="Registration"></input>
                </Link>
                <Link className="testLink" to={"/Home"}>
                  <input type="button" value="Home"></input>
                </Link>
                <Link className="testLink" to={"/Posts"}>
                  <input type="button" value="Posts"></input>
                </Link>
                <Link className="testLink" to={"/Trade"}>
                  <input type="button" value="Trade"></input>
                </Link>
                <Link className="testLink" to={"/Caretakers"}>
                  <input type="button" value="Caretakers"></input>
                </Link>
                <Link className="testLink" to={"/Settings"}>
                  <input type="button" value="Settings"></input>
                </Link>
                <Link className="testLink" to={"/Profile"}>
                  <input type="button" value="Profile"></input>
                </Link>
                <Link className="testLink" to={"/AdminDashboard"}>
                  <input type="button" value="AdminDashboard"></input>
                </Link>
              </div>
            )} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
