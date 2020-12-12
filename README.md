# team48 - Pawfriends

![homepage 1](https://raw.githubusercontent.com/csc309-fall-2020/team48/master/pawfriends/src/images/0main.png?token=ANTWPT3OZQHCPUYMXZBLYJS73VG4K "Home Page")

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

![login 1](https://raw.githubusercontent.com/csc309-fall-2020/team48/master/pawfriends/src/images/1login.png?token=ANTWPT5QGEGVNB27GEBIUQK73VHPY "login" )

## User Journey of Pawfriends - I. Main page
0. After you navigate to the heroke wep page, you would be able to see a login page.
1. You can check functionalities as an user or as an admin. 
2. For ease, we will provide you the credentials admin(ID) - admin(password) and user(ID) - user(password) for checking functionalities. However, we do have a page for login and a page for creating login credentials that are directed from the main page's `Register` button.
3. You will be able to see three different sections: Posts, Trades, and Services. You can navigate to each section by clicking this header.
4. The main page works like Newsfeed; if you click the content in either of Services, New Posts, Trade Pet Supplies, you will be directed to the corresponding section.


![trade 1](https://raw.githubusercontent.com/csc309-fall-2020/team48/master/pawfriends/src/images/3trade.png?token=ANTWPT2FNBXNU3ZPXMKMQW273VIN4 "trade")
## User Journey of Pawfriends - II. Regular User
0. Enter `user` for ID and `user` for password.
1. If you want to see the posts created by you, click `Post`. You can view previous posts, like a post, leave comments on the post (new feature), make a new post, or delete the post (new feature). Clicking any user's name or profile picture will redirect to their profile (new feature). Before deletion, when you click the button to delete the post, you will be asked to confirm if you actually want to delete the post (new feature).
2. If you want to see the posts for trades, click `Trade`. You can view previous trade posts and create a new trade. You can contact the poster to initiate the trade (new feature). To create a new trade post, click "CREATE TRADE". You can explore current trades or previous trades by clicking corresponding button(new feature). Also, you can delete the trade if you are the poster of the trade. The services section provide sorting functionality (new feature). You can filter posts by userID or tags, which creates a better view tailored to your or your pet's needs. For each posting of Services section, you can click the name of the poster to see what the poster is like, as this section is mainly intended for actual meetups that would leave a larger impact on you or your pets, such as matchmaking or pet daycare, compared to trading pet supplies. If you click contact info, it would give you the original poster's phone number and email so that you could contact the person to arrange a meetup for offering or receiving services (new feature). 
3. Click the profile icon in the top right of the navigation bar to open a dropdown menu which links to 'Profile', 'Settings', and 'Logout' pages.
4. In Profile, you can modify your status and view your profile information. Click the tabs to navigate between user info, your pets, and friends list. You can add or delete friends in this section (new feature). 
5. In Setting, you can edit your own personal information in profile section and account information in the account section
6. In the pets section, you can view your pet's about me section and edit it (new feature).



## User Journey of Pawfriends - III. Admin User
0. Enter `admin` for ID and `admin` for password.
1. You will be able to see the general statistics of our website such as the number of regular users, admin users, and posts.
2. You can manage regular site users by viewing their profile info or deleting a user's account.
3. You can explore the admin dashboard for user management. (New Feature)

# Overview of the routes

* `POST /users/:username/posts` : Creates a post for user with **username**
* `GET /users/:username/posts` : Gets array of posts from the user with **username**
* `POST /users/:username/posts` Delete the post with **postId** from user with **username**
* `GET /services` Gets array of all services in the DB
* `GET /trades` Gets array of all trades in the DB

### Library/Framework used: React, Node, Express, Mongodb, Mongoose
