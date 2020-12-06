import React from "react";
import "./App.css";

import { Route, Switch, BrowserRouter } from "react-router-dom";
import {checkSession} from "./actions/authenticationAndSessionCheck"


// Temporary: import various components so we can work on them
import Registration from "./components/Registration";
import Home from "./components/Home";
import Posts from "./components/Posts";
import Trade from "./components/Trade";
import Caretakers from "./components/Caretakers";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import Index from "./components/Index";

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
      curUserId: 1,
      currentUser: null
    };
    checkSession(this);
  }

  handleLogin = async (un, pw) => {
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
          title: "Having a great day",
          _id: 1,
          owner: {
            id: 1,
            username: "user",
            actualName: "John Smith",
            avatar: {
              image_id: "pawfriends/defaultAvatar_sflv0g.png",
              image_url:
                "https://res.cloudinary.com/dypmf5kee/image/upload/v1607124490/pawfriends/defaultAvatar_sflv0g.png",
            },
          },
          postTime: "2020-05-20T08:26:00.000Z",
          content: "Hope everyone's doing well!",
          image: 1,
          comments: [],
        },
        {
          title: "I love my cat",
          _id: 2,
          owner: {
            id: 2,
            username: "user2",
            actualName: "Jane Doe",
            avatar: {
              image_id: "pawfriends/defaultAvatar_sflv0g.png",
              image_url:
                "https://res.cloudinary.com/dypmf5kee/image/upload/v1607124490/pawfriends/defaultAvatar_sflv0g.png",
            },
          },
          postTime: "2020-07-30T14:26:00.000Z",
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
          tags: ["dog", "caretaking"],
        },
        {
          userId: 2,
          email: "jane.doe@gmail.com",
          phone: "222-222-2222",
          desc: "Tofu, a 2 year old shiba, is looking for his girlfriend!",
          tags: ["dog", "dating"],
        },
        {
          userId: 1,
          email: "john.smith@gmail.com",
          phone: "111-111-11111",
          desc: "I can take care of your pet any time next week!",
          tags: ["dog", "cat", "caretaking"],
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
          desc:
            "A rarely used, almost brand new squeaky ball. Would be great to meet up anywhere near Yonge and Eg",
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
          status: "Competitive coffee drinker",
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
          friends: [2],
        },
        {
          id: 2,
          type: "user",
          username: "user2",
          password: "user2",
          name: "Jane Doe",
          gender: "female",
          status: "Staying comfy",
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
          friends: [1],
        },
      ],
    });
  };

  render() {
    const { currentUser } = this.state;
    return (
      <div className="App">
        <BrowserRouter>
          {/* in phase 2, write function to switch modify navbar depending on user type (not logged in, user, admin) */}
          <NavBar {...this.props} app={this} appState={this.state}/>
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
              render={() => <Posts />}
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
            <Route
              exact path={["/", "/login"] /* any of these URLs are accepted. */ }
              render={ props => (
                <div className="app">
                    { /* Different componenets rendered depending on if someone is logged in. */}
                    {!currentUser ?  <Index {...props} app={this} appState={this.state} handleLogin={this.handleRegistration} /> :  <Home {...props} app={this} appState={this.state} />}
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
