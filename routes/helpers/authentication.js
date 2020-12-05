
// helpers for authentication

const { User } = require('../../models/user')

module.exports = {
	// Middleware for authentication of resources
	authenticate: (req, res, next) => {
		if (req.session.user) {
			User.findById(req.session.user).then((user) => {
				if (!user) {
					return Promise.reject()
				} else {
					req.user = user
					next()
				}
			}).catch((error) => {
				res.status(401).send("Unauthorized")
			})
		} else {
			res.status(401).send("Unauthorized")
		}
	},
	
	// Our own express middleware to check for 
	// an active user on the session cookie (indicating a logged in user.)
    sessionChecker: (req, res, next) => {		
	    if (req.session.user) {
	        res.redirect('/dashboard'); // redirect to dashboard if logged in.
	    } else {
	        next(); // next() moves on to the route.
	    }    
	}
}