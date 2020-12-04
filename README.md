# team48 - Pawfriends

<img src="https://i.imgur.com/Oi55XNV.png" alt="" width="90%"/>

## Deployed webpage link: https://pawfriend.herokuapp.com/
## Steps for local development environment setup
0. Have `npm` installed
1. Open a terminal shell and navigate to the root directory of this repo
2. Run `npm run setup` to install all dependencies
3. Make sure a the Mongo database service is running
4. Run `npm run build-run` to build the React app and start the Node server (to run the React development server, navigate to the `pawfriends` subdirectory and run `npm run start`)
5. Open the generated link in a browser (default local development link: http://localhost:5000/)

# Features of Pawfriends
The features of our web appliction includes creating posts for your pet, viewing the toys post from other people and creating a trade post, and viewing a list of people for matchmaking pets and pet daycare and making a post for daycare/matchmaking. The main page shows the aggregate of features for the website.

#  User Journeys

## User Journey of Pawfriends - I. Main page
0. After npm run start, you would be able to see a login page.
1. You can check functionalities as an user or as an admin. 
2. For ease, we will provide you the credentials admin(ID) - admin(password) and user(ID) - user(password) for checking functionalities. However, we do have a page for login and a page for creating login credentials that are directed from the main page's `Register` button.

## User Journey of Pawfriends - II. Regular User
0. Enter `user` for ID and `user` for password.
1. If you want to see the posts created by you, click `Post`. You can view previous posts, like a post, or make a new post. Clicking any user's name or profile picture will redirect to their profile.
2. If you want to see the posts for trades, click `Trade`. You can view previous trade posts, accept the trade, or create a new trade.
3. If you want to see the posts for pet daycare or matchmaking, click `Services`. You can see posts for dogsits or matchmaking, contact the poster, or create your own listing.
3. Click the profile icon in the top right of the navigation bar to open a dropdown menu which links to 'Profile', 'Settings', and 'Logout' pages.
4. In your user profile, you can modify your status and view your profile information. Click the tabs to navigate between user info, your pets, and friends list.
5. In the pets section, you can view your pet information, including their likes and dislikes.
6. If you want to modify your user profile, account, or site settings, visit the settings page via dropdown menu. Switch between the different setting section using the list on the left.


## User Journey of Pawfriends - III. Admin User
0. Enter `admin` for ID and `admin` for password.
1. You will be able to see the general statistics of our website such as the number of regular users, admin users, and posts.
2. You can manage regular site users by viewing their profile info or deleting a user's account.

# Overview of the routes

* `POST /users/:username/posts` : Creates a post for user with **username**
* `GET /users/:username/posts` : Gets array of posts from the user with **username**
* `POST /users/:username/posts` Delete the post with **postId** from user with **username**
* `GET /services` Gets array of all services in the DB
* `GET /trades` Gets array of all trades in the DB

### Library/Framework used: React, Node, Express, Mongodb, Mongoose