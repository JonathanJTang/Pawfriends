const baseUrl = process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:5000";
export const checkSession = (app) => {
    const url = baseUrl + "/users/check-session";
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
            if (json && json.currentUser) {
                app.setState({ currentUser: json.currentUser });
            }
        })
        .catch(error => {
            console.log(error);
        });
};

//todo: auth
