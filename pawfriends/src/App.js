import React from "react";
import "./App.css";

import { Link, Route, Switch, BrowserRouter } from "react-router-dom";

// Temporary: import various components so we can work on them
import Login from "./components/Login";
import Registration from "./components/Registration";
import Home from "./components/Home";
import Posts from "./components/Posts";
import Trade from "./components/Trade";
import Caretakers from "./components/Caretakers";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import NavBar from "./components/NavBar";

class App extends React.Component {
  // Global state passed to all components of the app
  constructor(props) {
    super(props);
    this.state = { users: [], posts: [], careTakers: [], curUserId: 0 };
  }

  componentDidMount = () => {
    document.title = "PawFriends";
    this.setState({
      posts: [
        {
          postName: "Me and my Dog",
          id: 1,
          username: "John Smith",
          usertype: "pet owner", //admin/pet owner
          datetime: "14:26 May 30, 2020",
          link:
            "https://i.pinimg.com/564x/9b/e8/ba/9be8ba888cb66d6bb2f879b4ea31261e.jpg",
          content: "This is my Dog\nLeave a comment!",
        },
        {
          postName: "My cat is so cute!",
          id: 2,
          username: "Jane Doe",
          usertype: "pet owner", //admin/pet owner
          datetime: "14:26 July 30, 2020",
          link:
            "https://media1.fdncms.com/inlander/imager/u/original/6575897/screen_shot_2017-11-10_at_11.24.41_am.png",
          content: "This is my Dog\nLeave a comment!",
        },
      ],
      careTakers: [
        {
          userId: 2,
          yearsOfExp: 2,
          pet: "Dog",
          careTakerName: "John Smith",
        },
        {
          userId: 2,
          yearsOfExp: 2,
          pet: "Cat",
          careTakerName: "John Smith",
        },
      ],
      users: [
        {
          username: "Ryan",
          type: "admin",
          id: 1,
          password: "123",
        },
        {
          name: "John Smith",
          type: "user",
          id: 2,
          password: "123",
        },
        {
          name: "Jane Doe",
          type: "user",
          id: 3,
          password: "123",
        },
      ],
    });
  };

  render() {
    return (
      <div className="App">
        {/* Sorry hiding it because it's showing up on other pages too :( */}
        {/* <h1>PawFriends Home</h1> */}
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/Login"
              render={() => <Login appState={this.state} />}
            />
            <Route
              exact
              path="/Registration"
              render={() => <Registration appState={this.state} />}
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
              path="/Profile"
              render={() => <Profile appState={this.state} />}
            />
            <Route
              exact
              path="/AdminDashboard"
              render={() => <AdminDashboard appState={this.state} />}
            />
            <Route
              path="/"
              render={() => (
                <div>
                  <Home appState={this.state} />
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
