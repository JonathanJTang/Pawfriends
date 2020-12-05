import React from "react";
import "./styles.css";
import "../Index/styles.css";
import { Link } from 'react-router-dom';
import NavBarGuest from "../NavBarGuest";
import { getAllUsersPosts, createPost, createUser } from "../../actions/apiRequests";

/* Registration component */
class Registration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        username: "",
        password: "",
        actualName: "",
        birthday: "",
        gender:"",
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

  handleRegistration = async (e) => {
    e.preventDefault();
    
    let user = await createUser({
      "username": this.state.user.username,
      "password": this.state.user.password,
      "actualName": this.state.user.actualName,
      "birthday": this.state.user.birthday,
      "gender": this.state.user.gender
    })
    if (user !== undefined) {
      alert("successfully made user"+ this.state.user.username)
    }
    
  };

  render() {
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
          <input
            type='text'
            name="actualName"
            
            onChange={this.handleChange}
          />
          <label>Birthday</label>
          <input
            type='date'
            name="birthday"
            onChange={this.handleChange}
          />
          <label>Gender</label>
          <select
            name="gender"
            onChange={this.handleChange}
          >
            <option disabled selected value> -- select an option -- </option>
            <option>Male</option>
            <option>Female</option>
            <option>Secret!</option>
          </select>
          <input type='submit'
            value="Register"
            onClick={this.handleRegistration}
          />
          <Link to='/' className='btn-reg btn-log'>Back to login</Link>
        </form>
      </div>
    );
  }
}

export default Registration;
