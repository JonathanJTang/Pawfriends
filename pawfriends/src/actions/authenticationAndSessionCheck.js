const baseUrl =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:5000";

export const checkSession = (stateUpdater) => {
  const url = baseUrl + "/users/check-session";
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (json && json.currentUser) {
        stateUpdater({ currentUser: json.currentUser });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// TODO: move login and logout auth methods here?
