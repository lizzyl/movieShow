var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')
var _ = require('underscore')

module.exports = function(app) {
	// pre handle user
	app.use(function(req, res, next) {
		var _user = req.session.user;

		app.locals.user = _user

		return next();
	})


//index
	// index page
	app.get('/', Index.index)


//user
	//signup
	app.post('/user/signup', User.signup)
	app.get('/signin', User.showSignin)
	app.get('/signup', User.showSignup)
	// userlist page
	app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list)

	//signin登录
	app.post('/user/signin', User.signin)

	//logout
	app.get('/logout', User.logout)



//movie
	//admin update movie
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)

	//admin post movie
	app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save)

	// list page
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)

	// detail page
	app.get('/movie/:id', Movie.detail)

	// admin page
	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)

	//list delete movie
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)




//comment
	app.post('/user/comment', User.signinRequired, Comment.save)

//category	
	app.get('/admin/category', User.signinRequired, User.adminRequired, Category.new);
	app.post('/admin/category/new', User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
	// app.get('/admin/category/update/:id', User.signinRequired, User.adminRequired, Category.update)

//results
	app.get('/results', Index.search);

}








