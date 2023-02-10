import React from "react";
import "./styles.css";

import AutoResizeTextarea from "../AutoResizeTextarea";
import { createService } from "../../actions/apiRequests";

class CreateServiceForm extends React.Component {
  handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const service = await createService({
      description: formData.get("description"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      tags: formData
        .get("tags")
        .split(",")
        .reduce((processed, element) => {
          // Remove empty string tags
          const trimmedElement = element.trim();
          if (trimmedElement !== "") {
            processed.push(trimmedElement);
          }
          return processed;
        }, []),
    });
    if (service !== undefined) {
      // Server call succeeded
      this.props.servicesList.unshift(service);
      this.props.parentStateUpdater(this.props.servicesList);
    }
  };

  render() {
    return (
      <form className="createPost" onSubmit={this.handleSubmit}>
        <input
          name="email"
          className="createPostTextarea"
          placeholder="Email:"
          required
        />
        <input
          name="phone"
          className="createPostTextarea"
          placeholder="Phone:"
          required
        />
        <AutoResizeTextarea
          minRows={2}
          className="createPostTextarea"
          type="text"
          name="description"
          placeholder="Description of service:"
          required
        />
        <input
          name="tags"
          className="createPostTextarea"
          placeholder="Tags (separate by commas):"
        />
        <input
          type="submit"
          value="Create Service Posting"
          className="createPostSubmitButton pawfriends-styled-button"
        />
      </form>
    );
  }
}

export default CreateServiceForm;
