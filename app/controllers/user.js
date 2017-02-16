var User = require('../models/user')

exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '注册页面'
	})
}

exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '登录页面'
	})
}

//signup
exports.signup = function(req, res) {
	var _user = req.body.user;//同req.param('user')
	// /user/signup/1111?userid=2990 req.query.userid

	User.findOne({name: _user.name}, function(err, user) {
		if(err) {
			console.log(err);
		}

		if(user) {
			return res.redirect('/signin');
		} else {
			var user = new User(_user);
			user.save(function(err, user) {
				if(err) {
					console.log(err);
				}
				res.redirect('/')
			});
		}
	})
}

// userlist page
exports.list = function(req, res) {

	User.fetch(function(err, users) {
		if(err) {
			console.log(err)
		}
		res.render('userlist', {
			title: 'movie 用户列表页',
			users: users
		})
	})		
	
}

//signin登录

exports.signin = function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({name: name}, function(err, user) {
		if(err) {
			console.log(err);
		}

		if(!user) {
			console.log('没有此用户')
			return res.redirect('/signup');
		}
		user.comparePassword(password, function(err, isMatch) {
			if(err) {
				console.log(err);
			}

			if(isMatch) {
				console.log('登陆成功')
				console.log(req.session)
				req.session.user = user;

				return res.redirect('/')
			} else {
				console.log('password is not matched!')
				return res.redirect('/signin')
				
			}
		})

	})
}

//logout
exports.logout = function(req, res) {
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/');
}


//midware for user

exports.signinRequired = function(req, res, next) {
	var user = req.session.user;
	if(!user) {
		return res.redirect('/signin')
	}
	next();
}
exports.adminRequired = function(req, res, next) {
	var user = req.session.user;

	if(user.role <= 10) {
		return res.redirect('/signin')
	}
	next()
}
