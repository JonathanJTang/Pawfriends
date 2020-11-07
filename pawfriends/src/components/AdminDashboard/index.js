import React from 'react';
import NavBarAdmin from '../NavBarAdmin';
import "./styles.css";

import logo from "./../../images/logo.png";
import logout from "./../../images/logout.png";

/* Admin dashboard component */
class AdminDashboard extends React.Component {
  render() {
    const {appState} = this.props;

    return (
      <div className="main">
        <NavBarAdmin />
        <div className="statsTableContainer">
          <h2>Site Statistics</h2>
          <table className="statsTable">
            <tr className="statsTableRow">
              <td className="statsTableLeftCell">Number of regular users</td>
              <td className="statsTableRightCell">
                {appState.users.reduce((total, user) => {
                  return user.type === "user" ? total + 1 : total
                }, 0)}</td>
            </tr>
            <tr className="statsTableRow">
              <td className="statsTableLeftCell">Number of admin users</td>
              <td className="statsTableRightCell">
                {appState.users.reduce((total, user) => {
                  return user.type === "admin" ? total + 1 : total
                }, 0)}</td>
            </tr>
            <tr className="statsTableRow">
              <td className="statsTableLeftCell">Total number of posts</td>
              <td className="statsTableRightCell">
                {appState.posts.length}</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;