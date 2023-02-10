import React from "react";

/* A textarea that resizes itself based on the text it contains, by changing the
  'rows' attribute on the textarea element.
  Takes in minRows prop, and passes all other props as attributes to the HTML
  textarea element. */
class AutoResizeTextarea extends React.Component {
  resizeTextarea = (e) => {
    const textarea = e.target;
    // Count rows by counting '\n' characters, but have at least minRows
    const num_rows = Math.max(
      this.props.minRows,
      1 + (textarea.value.match(/\n/g) || []).length
    );
    textarea.rows = num_rows;
  };

  render() {
    const { minRows, ...htmlAttributes } = this.props;
    return <textarea {...htmlAttributes} onInput={this.resizeTextarea} />;
  }
}

export default AutoResizeTextarea;
