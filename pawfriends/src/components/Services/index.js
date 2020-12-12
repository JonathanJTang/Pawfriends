import React from "react";
import "./styles.css";

import Service from "../Service";
import {
  createService,
  getAllServices,
  removeService,
} from "../../actions/apiRequests";

/* Services component */
class Services extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      servicesList: [],
      toggle: false,
      filter: "all",
      filterkey: "",
      newTrade: {
        description: "",
        email: "n/a",
        phone: "n/a",
        tags: "",
      },
    };
  }

  async componentDidMount() {
    // Fetch list of posts from server
    const servicesList = await getAllServices();
    if (servicesList !== undefined) {
      // Server call succeeded
      this.setState({ servicesList: servicesList });
    }
  }

  handleClick = () => {
    this.setState({ toggle: true });
  };

  handleChange = (e) => {
    this.state.newTrade[e.target.name] = e.target.value;
  };

  setFilter = (e) => {
    this.setState({ filter: e.target.value });
    this.setState({ filterkey: "" });
  };

  setFilterTag = (tag) => {
    this.setState({ filter: "tag", filterkey: tag });
  };

  handleFilter = (e) => {
    this.setState({ filterkey: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const service = await createService({
      description: this.state.newTrade.description,
      email: this.state.newTrade.email,
      phone: this.state.newTrade.phone,
      tags: this.state.newTrade.tags.split(",").map((tag) => tag.trim()),
    });
    if (service !== undefined) {
      // Server call succeeded
      this.state.servicesList.unshift(service);
      this.setState({ toggle: false });
    }
  };

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
    let filtered = this.state.servicesList;

    // filter by userId
    if (this.state.filterkey !== "" && this.state.filter === "user") {
      filtered = this.state.servicesList.filter((service) =>
        service.owner.actualName.startsWith(this.state.filterkey)
      );
    }

    // filter by post tags
    if (this.state.filterkey !== "" && this.state.filter === "tag") {
      filtered = this.state.servicesList.filter((service) =>
        service.tags.some((tag) => tag.startsWith(this.state.filterkey))
      );
    }

    return (
      <div className="posts">
        <div className="trade-header">
          <h2>
            Offer or receive services such as pet sitting and matchmaking!
          </h2>
          {this.state.toggle ? (
            <form className="createPost" onSubmit={this.handleSubmit}>
              <input
                name="email"
                className="createPostTextarea"
                placeholder="Email:"
                onChange={this.handleChange}
              />
              <input
                name="phone"
                className="createPostTextarea"
                placeholder="Phone:"
                onChange={this.handleChange}
              />
              <textarea
                className="createPostTextarea"
                type="text"
                name="description"
                placeholder="Description of service:"
                onInput={this.resizeTextarea.bind(this, 2)}
                required
                onChange={this.handleChange}
              />
              <input
                name="tags"
                className="createPostTextarea"
                placeholder="Tags (separate by commas):"
                onChange={this.handleChange}
              />
              <input
                type="submit"
                value="Create Post"
                className="createPostSubmitButton"
              />
            </form>
          ) : (
            <button onClick={this.handleClick}>Add a service</button>
          )}
        </div>
        <div className="postsList">
          <div className="filter">
            <select onChange={this.setFilter}>
              <option value="all" selected={this.state.filter === "all"}>
                All
              </option>
              <option value="user" selected={this.state.filter === "user"}>
                UserID
              </option>
              <option value="tag" selected={this.state.filter === "tag"}>
                Tag
              </option>
            </select>
            {this.state.filter !== "all" && (
              <input
                value={this.state.filterkey}
                onChange={this.handleFilter}
              />
            )}
          </div>
          {this.state.servicesList &&
            filtered.map((service, index) => (
              <Service
                key={index}
                service={service}
                user={service.owner}
                serviceArrayIndex={index}
                setFilterTag={this.setFilterTag}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default Services;
