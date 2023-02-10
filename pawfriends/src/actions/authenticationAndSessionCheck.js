const baseUrl =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:5000";

export const checkSession = (stateUpdater, history) => {
  const url = baseUrl + "/users/check-session";
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("User not logged in");
      }
    })
    .then((json) => {
      if (json && typeof json === "object") {
        stateUpdater({
          currentUsername: json.currentUsername,
          isAdmin: json.isAdmin,
        });
        console.log(`checkSession() got json obj below:`);
        console.log(json);
      }
    })
    .catch((error) => {
      history.replace("/"); // Redirect to login page when not logged in
    });
};

// TODO: move login and logout auth methods here?
