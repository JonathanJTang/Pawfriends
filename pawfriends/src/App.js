import React from "react";
import "./App.css";

import { Route, Switch, BrowserRouter } from "react-router-dom";

// Temporary: import various components so we can work on them
import Login from "./components/Login";
import Registration from "./components/Registration";
import Home from "./components/Home";
import Posts from "./components/Posts";
import Trade from "./components/Trade";
import Caretakers from "./components/Caretakers";
import Settings from "./components/Settings";
import Profile1 from "./components/Profile1";
import Profile2 from "./components/Profile2";
import AdminDashboard from "./components/AdminDashboard";
import Index from './components/Index';

import NavBar from './components/NavBar';

class App extends React.Component {
  // Global state passed to all components of the app
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      posts: [],
      careTakers: [],
      tradeToys: [],
      curUserId: -1,
    };
  }

  handleLogin = (username, password) => {
    let thisUser = this.state.users.find(
      (user) => user.username == username && user.password == password
    );
    if (thisUser) {
      if (
        (thisUser.type == "user" &&
          thisUser.username == "user" &&
          thisUser.password == "user") ||
        (thisUser.type == "admin" &&
          thisUser.username == "admin" &&
          thisUser.password == "admin")
      ) {
        console.log("user or admin per assignment");
      } else {
        console.log("every other user");
      }
      this.setState({ curUserId: thisUser.id });
    } else {
      console.log("doesn't exist");
      this.setState({ curUserId: -1 });
    }
  };

  handleRegistration = (un, pw) => {
    let userArr = this.state.users;
    if (pw != "") {
      let newUser = {
        username: un,
        type: "user",
        id: userArr.length + 1,
        password: pw,
      };
      userArr.push(newUser);
      this.setState({ users: userArr });
    }
  };

  componentDidMount = () => {
    document.title = "PawFriends";
    this.setState({
      posts: [
        {
          postName: "Having a great day",
          id: 1,
          userId: 1,
          datetime: "14:26 May 30, 2020",
          content: "Hope everyone's doing well!",
        },
        {
          postName: "I love my cat",
          id: 2,
          userId: 2,
          datetime: "14:26 July 30, 2020",
          content: "Her expression is so my mood right now",
        },
      ],
      services: [
        {
          userId: 1,
          desc: "Looking for someone to dogsit? I am the right one!"
        },
        {
          userId: 2,
          desc: "Tofu, a 2 year old shiba, is looking for his girlfriend!"
        },
        {
          userId: 1,
          desc: "I can take care of your pet any time next week!"
        },
      ],
      tradeToys: [
        {
          toyId: 1,
          userId: 2,
          desc: "Selling an almost brand new duck plush!",
        },
        {
          toyId: 2,
          userId: 1,
          desc: "A rarely used, almost brand new squeaky ball. Would be great to meet up anywhere near Yonge and Eg",
        },
        {
          toyId: 3,
          userId: 2,
          desc: "Squicky balls in bundle",
        },
      ],
      users: [
        {
          username: "admin",
          type: "admin",
          id: 0,
          password: "admin",
        },
        {
          username: "user",
          type: "user",
          id: 1,
          password: "user",
          name: "John Smith",
        },
        {
          username: "user2",
          type: "user",
          id: 2,
          password: "user2",
          name: "Jane Doe",
        },
      ],
    });
  };

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          {/* in phase 2, write function to switch modify navbar depending on user type (not logged in, user, admin) */}
          <NavBar />
          <Switch>
            {/* <Route
              exact
              path="/Login"
              render={() => (
                <Login appState={this.state} handleLogin={this.handleLogin} />
              )}
            /> */}
            <Route
              exact
              path="/Registration"
              render={() => (
                <Registration
                  appState={this.state}
                  handleRegistration={this.handleRegistration}
                />
              )}
            />
            <Route
              exact
              path="/Posts"
              render={() => <Posts appState={this.state} />}
            />
            <Route
              exact
              path="/Trade"
              render={() => <Trade appState={this.state} />}
            />
            <Route
              exact
              path="/Caretakers"
              render={() => <Caretakers appState={this.state} />}
            />
            <Route
              exact
              path="/Settings"
              render={() => <Settings appState={this.state} />}
            />
            <Route
              exact
              path="/Profile/1"
              render={() => <Profile1 appState={this.state} />}
            />
            <Route
              exact
              path="/Profile/2"
              render={() => <Profile2 appState={this.state} />}
            />
            <Route
              exact
              path="/AdminDashboard"
              render={() => <AdminDashboard appState={this.state} />}
            />
            <Route
              exact
              path="/Home"
              render={() => (
                <div>
                  <Home appState={this.state} />
                </div>
              )}
            />
            < Route path='/' render={(routeProps) => <Index {...routeProps} appState={this.state} />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
