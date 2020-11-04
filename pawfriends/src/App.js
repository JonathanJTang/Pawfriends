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
      console.log("doesnt exists");
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
      tradeToys: [
        {
          toyId: 1,
          ownerId: 3,
          toyImageLink:
            "https://ae01.alicdn.com/kf/Hf5ef8a4f9d7a49e6b7fd0df59eb967a92.jpg",
        },
      ],
      users: [
        {
          username: "user",
          type: "user",
          id: 1,
          password: "user",
        },
        {
          username: "admin",
          type: "admin",
          id: 2,
          password: "admin",
        },
        {
          username: "Ryan",
          type: "admin",
          id: 3,
          password: "123",
        },
        {
          username: "John Smith",
          type: "user",
          id: 4,
          password: "123",
        },
        {
          username: "Jane Doe",
          type: "user",
          id: 5,
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
              render={() => (
                <Login appState={this.state} handleLogin={this.handleLogin} />
              )}
            />
            <Route
              exact
              path="/Registration"
              render={() => (
                <Registration
                  appState={this.state}
                  handleLogin={this.handleLogin}
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
