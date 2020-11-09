import React from "react";
import "./styles.css";
import "../Index/styles.css";
import { Link } from 'react-router-dom';
import NavBarGuest from "../NavBarGuest";

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
      <div className='login'>
        <NavBarGuest />
        <form>
          <h1>Create a Pawfriends account</h1>
          <label>Account</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <label>Name</label>
          <input type='text' />
          <label>Birthday</label>
          <input type='date' />
          <label>Gender</label>
          <select>
            <option>Male</option>
            <option>Female</option>
            <option>Secret!</option>
          </select>
          <input type='submit'
            value="Register"
            onClick={() => {
              handleRegistration(
                this.state.user.username,
                this.state.user.password
              );
            }}
          />
          <Link to='/' className='btn-reg btn-log'>Back to login</Link>
        </form>
      </div>
    );
  }
}

export default Registration;
