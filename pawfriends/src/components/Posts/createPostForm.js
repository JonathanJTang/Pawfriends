import React from "react";
import "./styles.css";

import AutoResizeTextarea from "../AutoResizeTextarea";

import { createPost } from "../../actions/apiRequests";

class CreatePostForm extends React.Component {
  validFileTypes = [".png", ".jpg", ".jpeg", ".gif"];

  handleSubmit = async (e) => {
    e.preventDefault();
    const images = e.currentTarget.children.namedItem("image").files;
    for (const image of images) {
      const filenameSegments = image.name.split(".");
      if (
        !this.validFileTypes.includes(
          "." + filenameSegments[filenameSegments.length - 1].toLowerCase()
        )
      ) {
        // One of the uploaded files is not of a valid image type
        alert(
          `File "${image.name}" is not a valid image type (must be one of the ` +
            `following file types: ${this.validFileTypes.join(", ")})`
        );
        return;
      }
    }

    const formData = new FormData(e.currentTarget);
    const post = await createPost(formData);
    if (post !== undefined) {
      // Server call succeeded
      this.props.postsList.unshift(post);
      this.props.parentStateUpdater(this.props.postsList);
    }
  };

  render() {
    return (
      <form className="create-posting" onSubmit={this.handleSubmit}>
        <input
          className="create-posting"
          type="text"
          name="title"
          placeholder="Post title:"
          required
        />
        <AutoResizeTextarea
          minRows={2}
          className="create-posting"
          type="text"
          name="content"
          placeholder="Write a message:"
          required
        />
        <input
          className="create-posting-image-upload"
          type="file"
          name="image"
          accept={this.validFileTypes.join(", ")}
        />
        <input
          type="submit"
          value="Create Post"
          className="create-posting-submit pawfriends-styled-button"
        />
      </form>
    );
  }
}

export default CreatePostForm;
