import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";

/* Admin dashboard component */
class AdminDashboard extends React.Component {
  render() {
    const { appState } = this.props;
    // TODO: remove dependence on appState, instead get information from server calls

    return (
      <div className="stats">
        <div className="statsTableContainer">
          <h2>Site Statistics</h2>
          <table className="statsTable">
            <tbody>
              <tr className="statsTableRow">
                <td className="statsTableLeftCell">Number of regular users</td>
                <td className="statsTableRightCell">
                  {appState.users.reduce((total, user) => {
                    return user.type === "user" ? total + 1 : total;
                  }, 0)}
                </td>
              </tr>
              <tr className="statsTableRow">
                <td className="statsTableLeftCell">Number of admin users</td>
                <td className="statsTableRightCell">
                  {appState.users.reduce((total, user) => {
                    return user.type === "admin" ? total + 1 : total;
                  }, 0)}
                </td>
              </tr>
              <tr className="statsTableRow">
                <td className="statsTableLeftCell">Total number of posts</td>
                <td className="statsTableRightCell">{appState.posts.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>Manage regular users</h2>
        <div className="site-users">
          <Link to="/">
            <button>Exit dashboard</button>
          </Link>
          <div>
            <p>User Id</p>
            <p>1</p>
            <p>2</p>
          </div>
          <div>
            <p>Username</p>
            <p>user</p>
            <p>user2</p>
          </div>
          <div>
            <p>Actions</p>
            <button>User info</button>
            <button>User info</button>
          </div>
          <div>
            <p>..</p>
            <button>Delete user</button>
            <button>Delete user</button>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
