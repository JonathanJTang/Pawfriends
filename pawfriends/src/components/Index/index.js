import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";
import { loginUser } from "../../actions/apiRequests";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", error: false };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const user = await loginUser({
      username: this.state.username,
      password: this.state.password,
    });
    if (user !== undefined) {
      alert("You've successfully logged in!");
      window.location.reload();
    } else {
      alert("Bad login: No such username and password combination");
    }
  };

  render() {
    return (
      <div className="login">
        <form>
          <h1>Welcome back!</h1>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={this.handleChange}
            className={this.state.error ? "login-error" : ""}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
            className={this.state.error ? "login-error" : ""}
          />
          <input type="submit" value="Login" onClick={this.handleLogin} />
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
