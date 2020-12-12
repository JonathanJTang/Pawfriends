import React from "react";
import "./App.css";

import { Route, Switch, BrowserRouter } from "react-router-dom";
import { checkSession } from "./actions/authenticationAndSessionCheck";

import Registration from "./components/Registration";
import Home from "./components/Home";
import Posts from "./components/Posts";
import Trades from "./components/Trades";
import Services from "./components/Services";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import Index from "./components/Index";

import NavBar from "./components/NavBar";
import NavBarGuest from "./components/NavBarGuest";

class App extends React.Component {
  // Global state passed to all components of the app
  constructor(props) {
    super(props);
    this.state = { currentUser: null };
    // checkSession(this);  // moved to componentDidMount
  }

  // handleLogin = async (un, pw) => {
  // let thisUser = this.state.users.find(
  //   (user) => user.un == un && user.pw == pw
  // );
  // if (thisUser) {
  //   if (
  //     (thisUser.type == "user" &&
  //       thisUser.un == "user" &&
  //       thisUser.pw == "user") ||
  //     (thisUser.type == "admin" &&
  //       thisUser.un == "admin" &&
  //       thisUser.pw == "admin")
  //   ) {
  //     console.log("user or admin per assignment");
  //   } else {
  //     console.log("every other user");
  //   }
  //   this.setState({ curUserId: thisUser.id });
  // } else {
  //   console.log("doesn't exist");
  //   this.setState({ curUserId: -1 });
  // }
  // };

  // handleRegistration = (un, pw) => {
  //   // TODO: have this method make a server call
  //   let userArr = this.state.users;
  //   if (pw != "") {
  //     let newUser = {
  //       username: un,
  //       type: "user",
  //       id: userArr.length + 1,
  //       password: pw,
  //     };
  //     userArr.push(newUser);

  //     this.setState({ users: userArr });
  //   }
  // };

  componentDidMount = () => {
    document.title = "PawFriends";
    checkSession(this);
    console.log("Checked session");
  };

  render() {
    const { currentUser } = this.state;
    console.log(currentUser);
    return (
      <div className="App">
        <BrowserRouter>
          {currentUser ? (
            <NavBar app={this} currentUser={currentUser} />
          ) : (
            <NavBarGuest />
          )}
          <Switch>
            <Route
              exact
              path="/registration"
              render={(props) => <Registration {...props} />}
            />
            <Route
              exact
              path="/posts"
              render={(props) => <Posts {...props} />}
            />
            <Route
              exact
              path="/trades"
              render={(props) => <Trades {...props} />}
            />
            <Route
              exact
              path="/services"
              render={(props) => <Services {...props} />}
            />
            <Route
              exact
              path="/settings"
              render={() => <Settings currentUser={currentUser} />}
            />
            <Route
              exact
              path="/profile/:id"
              render={(props) => (
                <Profile {...props} currentUser={currentUser} />
              )}
            />
            <Route
              exact
              path="/admindashboard"
              render={() => <AdminDashboard appState={this.state} />}
            />
            <Route
              exact
              path={["/", "/login"] /* any of these URLs are accepted. */}
              render={(props) => (
                <div className="app">
                  {/* Different componenets rendered depending on if someone is logged in. */}
                  {!currentUser ? (
                    <Index />
                  ) : (
                    <Home {...props} app={this} appState={this.state} />
                  )}
                </div>
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
