
import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";

class Service extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
    }
  }



  handleClick = () => {
    this.state.toggle ? this.setState({ toggle: false }) : this.setState({ toggle: true });
  }

  handleSelectTag = (e, tag) => {
    e.preventDefault();
    this.props.setFilterTag(tag);
  }

  render() {
    const { service, user } = this.props;
 
    return (
      <div className="trade">
        <div className="header">
          <Link to={`/profile/${user.id}`}>
            <img src={require(`../../images/user${user.id}.png`).default} />
          </Link>

          <div className="postText">
            <Link to={`/profile/${user.id}`}>
              <p>@{user.name}</p>
            </Link>
            {service.desc}
            <p>{service.tags.map(tag => (
              <Link onClick={e => this.handleSelectTag(e, tag)}>{`#${tag} `}</Link>
            ))}</p>
          </div>
        </div>
        {this.state.toggle ?
          <div className='tradeinfo'>
            <div>
              <strong>Email:</strong>
              <strong>Phone:</strong>
            </div>
            <div>
              <p>{service.email}</p>
              <p>{service.phone}</p>
            </div>
            <button onClick={this.handleClick}>Close</button>
          </div>
          :
          <div>
          <view>
          <view style = {{flex: 1}}>
          <button onClick={this.handleClick}>Contact user</button></view>
          <view style = {{flex: 1, marginLeft: '20px'}}>
          <button onClick = {this.handleClick}>Delete post</button></view>
          </view>
          </div>
        }
      </div>
    );
  }
}



/* Services component */
class Caretakers extends React.Component {
  constructor(props) {
    super(props);
    const curUserId = this.props.appState.curUserId;
    
    this.state = {
      toggle: false,
      filter: "all",
      filterkey: "",
      newTrade: {
        userId: curUserId,
        desc: "",
        email: "n/a",
        phone: "n/a",
        tags: "",
      }
    }
  }


  handleClick = () => {
    this.setState({ toggle: true });
  }

  handleChange = e => {
    this.state.newTrade[e.target.name] = e.target.value;
  }

  setFilter = e => {
    this.setState({ filter: e.target.value });
    this.setState({ filterkey: "" });
  }

  setFilterTag = tag => {
    this.setState({ filter: "tag", filterkey: tag });
  }

  handleFilter = e => {
    this.setState({ filterkey: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const trades = this.props.appState.services;
    // replace with server call
    trades.push({
      userId: 1,
      desc: this.state.newTrade.desc,
      email: this.state.newTrade.email,
      phone: this.state.newTrade.phone,
      tags: this.state.newTrade.tags.split(',').map(tag => tag.trim()),
    })
    this.setState({ toggle: false });
  }

  resizeTextarea = (initialRows, event) => {
    const textarea = event.target;
    // Count rows by counting '\n' characters, but have at least initialRows
    const num_rows = Math.max(
      initialRows,
      1 + (textarea.value.match(/\n/g) || []).length
    );
    textarea.rows = num_rows;
  };




  render() {
    // replace with server call to get all services
    let filtered = this.props.appState.services;

    // filter by userId
    if (this.state.filterkey != "" && this.state.filter == 'user') {
      filtered = this.props.appState.services.filter(service => service.userId == this.state.filterkey);
    }

    // filter by post tags
    if (this.state.filterkey != "" && this.state.filter == 'tag') {
      filtered = this.props.appState.services.filter(service => service.tags.includes(this.state.filterkey));
    }

    return (
      <div className="posts">
      <p> Offer or receive services such as pet sitting and matchmaking!</p>
        {this.state.toggle ?
          <form className="createPost" onSubmit={this.handleSubmit}>
            <input name='email' className="createPostTextarea" placeholder="Email:" onChange={this.handleChange} />
            <input name='phone' className="createPostTextarea" placeholder="Phone:" onChange={this.handleChange} />
            <textarea
              className="createPostTextarea"
              type="text"
              name="desc"
              placeholder="Description of service:"
              onInput={this.resizeTextarea.bind(this, 2)}
              required
              onChange={this.handleChange}
            />
            <input name='tags' className="createPostTextarea" placeholder="Tags (separate by commas):" onChange={this.handleChange} />
            <input
              type="submit"
              value="Create Post"
              className="createPostSubmitButton"
            />
          </form>
          :
          <button onClick={this.handleClick}>Add a service</button>
        }
        <div className="postsList">
          <div className="filter">
            <select onChange={this.setFilter}>
              <option value='all' selected={this.state.filter == 'all'}>All</option>
              <option value='user' selected={this.state.filter == 'user'}>UserID</option>
              <option value='tag' selected={this.state.filter == 'tag'}>Tag</option>
            </select>
            {this.state.filter != 'all' &&
              <input value={this.state.filterkey} onChange={this.handleFilter} />
            }
          </div>
          {this.props.appState.services && filtered.reverse().map((service, index) => (
            <Service
              key={index}
              service={service}
              user={null /*TODO: remove dependence on appState, get necessary information from server */ /*this.props.appState.users[service.userId]*/}
              setFilterTag={this.setFilterTag}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Caretakers;