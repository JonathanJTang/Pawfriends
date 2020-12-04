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
import Profile from "./components/Profile";
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
      curUserId: 1,
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
          image: 1,
          comments: [],
        },
        {
          postName: "I love my cat",
          id: 2,
          userId: 2,
          datetime: "14:26 July 30, 2020",
          content: "Her expression is so my mood right now",
          image: 2,
          comments: [],
        },
      ],
      services: [
        {
          userId: 1,
          email: "john.smith@gmail.com",
          phone: "111-111-11111",
          desc: "Looking for someone to dogsit? I am the right one!",
          tags: ['dog', 'caretaking'],
        },
        {
          userId: 2,
          email: "jane.doe@gmail.com",
          phone: "222-222-2222",
          desc: "Tofu, a 2 year old shiba, is looking for his girlfriend!",
          tags: ['dog', 'dating'],
        },
        {
          userId: 1,
          email: "john.smith@gmail.com",
          phone: "111-111-11111",
          desc: "I can take care of your pet any time next week!",
          tags: ['dog', 'cat', 'caretaking'],
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
          id: 0,
          type: "admin",
          username: "admin",
          password: "admin",
        },
        {
          id: 1,
          type: "user",
          username: "user",
          password: "user",
          name: "John Smith",
          gender: "male",
          status: 'Competitive coffee drinker',
          birthday: "1998-07-22",
          location: "Toronto, Canada",
          favpet: "dog",
          pets: [
            {
              name: "Mimi",
              likes: "Naps, looking at birds",
              dislikes: "Rain",
            },
            {
              name: "Lupin",
              likes: "Flowers, walks, rain",
              dislikes: "Thunder",
            },
          ],
          // stores the ids of this user's friends
          friends: [
            2,
          ]
        },
        {
          id: 2,
          type: "user",
          username: "user2",
          password: "user2",
          name: "Jane Doe",
          gender: "female",
          status: 'Staying comfy',
          birthday: "1999-03-09",
          location: "Ottawa, Canada",
          favpet: "cat",
          pets: [
            {
              name: "Cinnamon",
              likes: "Treats, music",
              dislikes: "Strangers",
            },
          ],
          friends: [
            1,
          ]
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
              path="/profile/:id"
              render={(props) => <Profile {...props} appState={this.state} />}
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
