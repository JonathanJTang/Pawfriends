import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import NavBarGuest from "../NavBarGuest";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: { name: "", pass: "" }, error: false };
  }

  handleChange = (e) => {
    this.state.input[e.target.name] = e.target.value;
    this.setState({ input: this.state.input });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validate() == 1) {
      this.props.history.push("/home");
    } else if (this.validate() == 2) {
      this.props.history.push("/admindashboard");
    }
  };

  validate = () => {
    const user = this.props.appState.users.find(
      (user) => user.username === this.state.input["name"]
    );
    if (user !== undefined && this.state.input["pass"] === user.password) {
      // Username and password matches one of the registered users
      if (user.type === "user") {
        return 1;
      }
      if (user.type === "admin") {
        return 2;
      }
    }
    this.setState({ error: true }); // Otherwise, an error occurred
  };

  render() {
    return (
      <div className="login">
        <NavBarGuest />
        <form>
          <h1>Welcome back!</h1>
          <input
            type="text"
            name="name"
            placeholder="Username"
            onChange={this.handleChange}
            className={this.state.error ? "login-error" : ""}
          />
          <input
            type="password"
            name="pass"
            placeholder="Password"
            onChange={this.handleChange}
            className={this.state.error ? "login-error" : ""}
          />
          <input type="submit" value="Login" onClick={this.handleSubmit} />
          <p>Don't have an account?</p>
          <Link to="/registration" className="btn-reg">
            Register
          </Link>
        </form>
      </div>
    );
  }
}

export default Index;