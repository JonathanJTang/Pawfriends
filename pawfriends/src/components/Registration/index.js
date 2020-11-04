import React from "react";
import "./styles.css";
import NavBar from "../NavBar";

/* Registration component */
class Registration extends React.Component {
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

  render() {
    const { handleRegistration } = this.props;
    return (
      <div>
        <NavBar />
        <h1>Register a PawFreinds account</h1>
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
            handleRegistration(
              this.state.user.username,
              this.state.user.password
            );
          }}
        >
          Submit
        </button>
      </div>
    );
  }
}

export default Registration;
