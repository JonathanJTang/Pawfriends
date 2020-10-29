import React from "react";
import "./styles.css";

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

  handleSubmit = (event) => {
    //TODO
    this.setState({ submitted: true });
    const { user } = this.state;
    if (user.firstName && user.lastName && user.username && user.password) {
      //register them
    }
  };

  render() {
    return (
      <div>
        <h1>Register a Paw Freinds account</h1>
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
            this.handleSubmit();
          }}
        >
          Submit
        </button>
      </div>
    );
  }
}

export default Registration;
