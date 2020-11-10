import React from "react";

import { Link } from "react-router-dom";

import av1 from "../../images/user1.png";
import av2 from "../../images/user2.png";

class Service extends React.Component {
  render() {
    const { service, user } = this.props;

    const img = {
      avatars: {
        1: av1,
        2: av2,
      },
    }

    return (
      <div className="trade">
        <div className="header">
          <Link to={"/profile/" + user.id}>
            <img src={img.avatars[user.id]} />
          </Link>
          <div className="postText">
            <Link to={"/profile/" + user.id}>
              <p>@{user.name}</p>
            </Link>
            {service.desc}
          </div>
        </div>
        <button>Contact user</button>
      </div>
    );
  }
}

/* Services component */
class Caretakers extends React.Component {
  render() {
    let services;
    if (this.props.appState.services) {
      services = this.props.appState.services.map((service, index) => (
        <Service key={index} service={service} user={this.props.appState.users[service.userId]} />
      ));
    }

    return (
      <div className="posts">
        <button>Add a service</button>
        <div className="postsList">
          {services}
        </div>
      </div>
    );
  }
}

export default Caretakers;