import React from "react";
import "./styles.css";
import NavBar from "../NavBar";

/* Login component */
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        username: "",
        password: "",
      },
      submitted: false,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value,
      },
    });
  };

  handleLoginLogin = (username, pw) => {
    const { handleLogin } = this.props;
    handleLogin(username, pw);
  };

  render() {
    return (
      <div>
        <NavBar />
        <h1>Login to your PawFreinds account</h1>
        <label>
          User Name:
          <input
            type="text"
            name="username"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="text"
            name="password"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        {/* TODO: change to form */}
        <button
          type="submit"
          value="Submit"
          onClick={() => {
            this.handleLoginLogin(
              this.state.user.username,
              this.state.user.password
            );
          }}
        >
          Log in
        </button>
      </div>
    );
  }
}

export default Login;
